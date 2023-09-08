import { fail } from "@sveltejs/kit";
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
type Artist = {
  username: string;
  avatar_url: string;
};
export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  const { data: songFetch, error: songError } = await supabase
    .from("songs")
    .select(
      `artist, name, song_url, created_at, id, profiles (avatar_url, username)`
    )
    .range(0, 4);

  const { data: profileFetch, error: profileError } = await supabase
    .from("profiles")
    .select(`username, avatar_url`)
    .range(0, 4);

  if (songError || profileError) {
    fail(500, {
      songError,
      profileError,
    });
  }
  //@ts-ignore
  //? So hard to type the data from supabase db fetch. Need to generate types from db.
  let songData: SongRow[] = [].concat(songFetch);

  return { songData, profileFetch };
};
