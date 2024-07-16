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
  const {
    data: { session },
  } = await supabase.auth.getSession();
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
};
