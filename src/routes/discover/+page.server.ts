import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
type SongRow = {
  artist: string | null;
  created_at: string | null;
  id: number;
  name: string | null;
  song_url: string | null;
  profiles: {
    avatar_url: string;
  };
};
export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  const { data: dbFetch, error: dbError } = await supabase
    .from("songs")
    .select(`artist, name, song_url, created_at, id, profiles ( avatar_url)`);

  //@ts-ignore
  //? So hard to type the data from supabase db fetch. Need to generate types from db.
  let dbData: SongRow[] = [].concat(dbFetch);

  if (!dbError) {
    fail(500, {
      dbError,
    });
  }
  return { dbData };
};
