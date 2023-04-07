import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals: { supabase, getSession } }) => {
  const session = await getSession();

  if (!session) {
    throw redirect(303, "/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select(`username, full_name, website, avatar_url`)
    .eq("id", session.user.id)
    .single();

  return { session, profile };
}) satisfies PageServerLoad;
