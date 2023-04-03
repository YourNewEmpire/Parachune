import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  const { data: dbFetch, error: dbError } = await supabase
    .from("songs")
    .select(`artist, name, song_url, created_at`);
  //@ts-ignore
  //? So hard to type the data from supabase db fetch. Need help tbh.
  let dbData: SongRow[] = [].concat(dbFetch);
  if (!dbError) {
    fail(500, {
      dbError,
    });
  }
  return { dbData };
};
