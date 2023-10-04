import { createSupabaseLoadClient } from "@supabase/auth-helpers-sveltekit";
import type { LayoutLoad } from "./$types";

//? Create supabase auth session for the client, during hydration phase
export const load: LayoutLoad = async ({ fetch, data, depends, url }) => {
  depends("supabase:auth");
  // Handle supabase, session and profile for the client
  const supabase = createSupabaseLoadClient({
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    event: { fetch },
    serverSession: data.session,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: profile } = await supabase
    .from("profiles")
    .select(`username, full_name, website, avatar_url, paypal_id`)
    .eq("id", session?.user.id)
    .single();

  return { supabase, session, url: url.pathname, profile };
};
