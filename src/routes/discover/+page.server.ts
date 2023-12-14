import { fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
type SongRow = {
  artist_id: number;
  created_at: string | null;
  id: number;
  name: string | null;
  song_url: string | null;
  profiles: {
    id: string;
    username: string;
    avatar_url: string;
  };
};

export const load: PageServerLoad = async ({
  locals: { supabase },
  parent,
}) => {
  const { data: songFetch, error: songError } = await supabase
    .from("songs")
    .select(
      `artist_id, name, song_url, created_at, id, profiles (id, avatar_url, username)`
    )
    .range(0, 4);

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select(`username, avatar_url, id`)
    .range(0, 4)
    .not("username", "is", null);

  if (songError || profileError) {
    fail(500, {
      songError,
      profileError,
    });
  }
  //@ts-ignore
  //? So hard to type the data from supabase db fetch. Need to generate types from db.
  let songData: SongRow[] = [].concat(songFetch);
  const { profile, session } = await parent();
  return { songData, profileData, profile, session };
};
