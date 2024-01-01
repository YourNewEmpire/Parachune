import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

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
  //@ts-ignore
  //? So hard to type the data from supabase db fetch. Need help tbh.

  return { session, dbData };
};
