import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getProfile } from "$lib/server/getProfile";

export const prerender = false;

export const load: PageServerLoad = async ({
  locals: { supabase, getSession },
}) => {
  const session = await getSession();
  if (!session) {
    throw redirect(303, "/");
  }

  const { data: dbData, error: dbError } = await supabase
    .from("songs")
    .select("*")
    .eq("artist_id", session.user.id);
  const profile = await getProfile({ supabase, session });

  return { profile, dbData };
};
