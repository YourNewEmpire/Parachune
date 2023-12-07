import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({
  locals: { supabase, getSession },
  parent,
}) => {
  const session = await getSession();
  let songIds: number[] = [];

  if (!session) {
    throw redirect(303, "/login");
  }

  const { data: likedData, error: likedDataError } = await supabase
    .from("saved songs")
    .select("song_id")
    .eq("user_id", session.user.id);

  likedData?.forEach((obj, ind) => {
    songIds.push(obj.song_id);
  });

  const { data: songs, error: songsError } = await supabase
    .from("songs")
    .select(
      `song_url, name, artist_id, id, created_at, profiles (avatar_url, username)`
    )
    .in("id", songIds);

  if (songsError) {
    throw error(404, "Error getting data about songs you like");
  }
  const { profile } = await parent();
  return { savedSongs: songs, profile, session };
};
