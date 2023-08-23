import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

type SongRow = {
  artist: string | null;
  created_at: string | null;
  id: number;
  name: string | null;
  song_url: string | null;
  description: string | null;
  lyrics: string | null;
  profiles: {
    avatar_url: string;
  };
};
export const load: PageServerLoad = async ({
  locals: { supabase },
  params,
}) => {
  const { data: songData, error: songError } = await supabase
    .from("songs")
    .select(
      `artist, name, description, lyrics, song_url, created_at, id, profiles ( avatar_url, username)`
    )
    .eq("name", params.slug)
    .single();
  let song: SongRow | any = songData;
  return { song };
};
