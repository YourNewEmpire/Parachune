import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals: { supabase, getSession } }) => {
  const session = await getSession();
  let songIds: number[] = [];
  if (!session) {
    throw redirect(303, "/login");
  }

  const { data: likedData, error: likedDataError } = await supabase
    .from("liked songs")
    .select("song_id")
    .eq("user_id", session.user.id);

  likedData?.forEach((obj, ind) => {
    songIds.push(obj.song_id);
  });
  const { data: songs } = await supabase
    .from("songs")
    .select(`song_url, name, artist`)
    .in("id", songIds);

  console.log(songs);
  return { session, likedSongs: songs };
}) satisfies PageServerLoad;
