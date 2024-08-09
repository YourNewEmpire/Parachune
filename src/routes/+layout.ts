import {
  createBrowserClient,
  isBrowser,
  createServerClient,
} from "@supabase/ssr";

import type { LayoutLoad } from "./$types";

//? Create supabase auth session for the client, during hydration phase
export const load: LayoutLoad = async ({ fetch, data, depends, url }) => {
  depends("supabase:auth");
  // Handle supabase, session and profile for the client
  const supabase = isBrowser()
    ? createBrowserClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY,
        {
          global: {
            fetch,
          },
        }
      )
    : createServerClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY,
        {
          global: {
            fetch,
          },
          cookies: {
            getAll() {
              return data.cookies;
            },
          },
        }
      );
  //? get session on the client
  const session = isBrowser()
    ? (await supabase.auth.getSession()).data.session
    : data.session;

  //? I need this profile fetched here to pass username (and potentially more in future) to the layout.svelte file
  //* fetch profile if user has a session, else return the empty session and handle in client
  if (session) {
    const { data: profile } = await supabase
      .from("profiles")
      .select(`*`)
      .eq("id", session?.user.id)
      .single();

    return {
      supabase,
      session,
      url: url.pathname,
      profile: profile,
    };
  }

  return {
    supabase,
    session,
    url: url.pathname,
  };
};
