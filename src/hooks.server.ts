import { createServerClient } from "@supabase/ssr";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  //? Create supabase server client with cookies config
  event.locals.supabase = createServerClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return event.cookies.getAll();
        },
        setAll(cookiesToSet) {
          /**
           * Note: You have to add the `path` variable to the
           * set and remove method due to sveltekit's cookie API
           * requiring this to be set, setting the path to an empty string
           * will replicate previous/standard behavior (https://kit.svelte.dev/docs/types#public-types-cookies)
           */
          cookiesToSet.forEach(({ name, value, options }) =>
            event.cookies.set(name, value, { ...options, path: "/" })
          );
        },
      },
    }
  );

  // More secure version of getSession. Verify in the backend that the user is valid.
  event.locals.checkAuth = async () => {
    const {
      data: { user },
      error,
    } = await event.locals.supabase.auth.getUser();
    if (!user || error) {
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
