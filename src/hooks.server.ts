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
          event.cookies.set(key, value, { ...options, path: "/" });
        },
        remove: (key, options) => {
          event.cookies.delete(key, { ...options, path: "/" });
        },
      },
    }
  );

  // More secure version of getSession. Verify in the backend that the user is valid.
  event.locals.checkAuth = async () => {
    const {
      data: { user },
    } = await event.locals.supabase.auth.getUser();
    if (!user) {
      return false;
    } else return true;
  };

  //? Helpers on locals object for loaders.
  event.locals.getSession = async () => {
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession();
    // get profile here and put return obj
    return session;
  };

  //? Set secure headers.
  event.setHeaders({
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "autoplay=(self)",
    "X-Content-Type-Options": "nosniff",
  });
  const theme = event.cookies.get("siteTheme");
  //? Issue fixed with if statement, stop passing "undefined" which was an edge case that was causing ux issues.
  if (theme) {
    return resolve(event, {
      /**
       *
       * There´s an issue with `filterSerializedResponseHeaders` not working when using `sequence`
       *
       * https://github.com/sveltejs/kit/issues/8061
       */
      filterSerializedResponseHeaders(name) {
        return name === "content-range";
      },
      transformPageChunk: ({ html }) =>
        html.replace('data-theme=""', `data-theme="${theme}"`),
    });
  } else {
    return resolve(event, {
      /**
       *
       * There´s an issue with `filterSerializedResponseHeaders` not working when using `sequence`
       *
       * https://github.com/sveltejs/kit/issues/8061
       */
      filterSerializedResponseHeaders(name) {
        return name === "content-range";
      },
    });
  }
};
