import { createServerClient } from "@supabase/ssr";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  //? Create supabase server client with cookies config
  event.locals.supabase = createServerClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (key) => event.cookies.get(key),
        set: (key, value, options) => {
          event.cookies.set(key, value, options);
        },
        remove: (key, options) => {
          event.cookies.delete(key, options);
        },
      },
    }
  );

  //? Helpers on locals object for loaders.
  event.locals.getSession = async () => {
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession();
    return session;
  };
  event.locals.getProfile = async () => {
    const session = await event.locals.getSession();
    if (!session) {
      return null;
    }
    const { data: profile } = await event.locals.supabase
      .from("profiles")
      .select(`username, full_name, website, avatar_url, stripe_id`)
      .eq("id", session?.user.id)
      .single();
    return profile;
  };

  //? Set secure headers.
  event.setHeaders({
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "autoplay=(self)",
    "X-Content-Type-Options": "nosniff",
  });
  return resolve(event, {
    /**
     * There´s an issue with `filterSerializedResponseHeaders` not working when using `sequence`
     *
     * https://github.com/sveltejs/kit/issues/8061
     */
    filterSerializedResponseHeaders(name) {
      return name === "content-range";
    },
  });
};
