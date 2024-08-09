import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getProfile } from "$lib/server/getProfile";
import { invalidate } from "$app/navigation";

export const prerender = false;

export const load: PageServerLoad = async ({
  locals: { supabase, getSession, checkAuth },
}) => {
  const authCheck = await checkAuth();

  if (!authCheck) {
    invalidate("supabase:auth");
    throw redirect(401, "/");
  }
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
