import { error, redirect } from "@sveltejs/kit";
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
    username: string;
  };
  likes: number;
  isLiked: boolean | "unset";
};
export const load: PageServerLoad = async ({
  locals: { supabase, getSession },
  params,
}) => {
  const session = await getSession();
  let isLiked: boolean | "unset" = "unset";

  const { data: songData, error: songDataErr } = await supabase
    .from("songs")
    .select(
      `artist, name, description, lyrics, song_url, created_at, id, profiles ( avatar_url, username)`
    )
    .eq("name", params.slug)
    .single();

  if (songDataErr) {
    throw error(404, {
      message: "Song not found",
    });
  }

  const {
    data: songLikes,
    error: songLikesErr,
    count,
  } = await supabase
    .from("song_likes")
    .select(`liked`, { count: "exact", head: true })
    .eq("song_id", songData?.id)
    .eq("liked", true);

  if (songLikesErr) {
    throw error(500, {
      message: "Server error when getting song data",
    });
  }
  // this will block unauthed !!!!!!!!!
  if (!session) {
    let song: SongRow | any = { ...songData, likes: count ?? 0, liked: null };

    return { song };
  }
  const { data: userLiked, error: userLikedErr } = await supabase
    .from("song_likes")
    .select(`user_id, liked`)
    .eq("user_id", session?.user.id)
    .single();

  if (userLiked) {
    // console.log(`server side user liked result ${userLiked.liked}`);
    isLiked = userLiked.liked;
  }
  let song: SongRow | any = { ...songData, likes: count ?? 0, liked: isLiked };

  return { song };
};
