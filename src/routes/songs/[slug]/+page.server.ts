import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

type SongRow = {
  artist_id: string | null;
  created_at: string | null;
  id: number;
  name: string | null;
  song_url: string | null;
  description: string | null;
  lyrics: string | null;
  profiles: {
    avatar_url: string;
    username: string;
    id: number;
  };
  likes: number;
  isLiked: boolean | "unset";
};

export const load: PageServerLoad = async ({
  locals: { supabase },
  params,
  parent,
}) => {
  const { data: songData, error: songDataErr } = await supabase
    .from("songs")
    .select(
      `artist_id, name, description, lyrics, song_url, created_at, id, profiles (id, avatar_url, username)`
    )
    .eq("id", params.slug)
    .single();

  if (songDataErr) {
    throw error(404, {
      message: "Song not found",
    });
  }

  let song: SongRow | any = { ...songData };
  const { profile, session } = await parent();
  return { song, profile, session };
};
