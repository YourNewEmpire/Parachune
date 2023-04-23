import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({
  request,
  locals: { supabase, getSession },
}) => {
  const session = await getSession();
  if (!session) {
    return json({ message: "not logged in" });
  }
  const { songId, songUrl } = await request.json();

  //? Search for song id in likes. If it already exists, quit
  const { data: saveData, error: saveDataError } = await supabase
    .from("liked songs")
    .select("*")
    .eq("song_id", songId);
  if (saveDataError) {
    return json({
      message: "error when syncing saved songs, try again",
      toastType: "failure",
    });
  }
  if (saveData.length > 0) {
    return json({ message: "Song already liked", toastType: "info" });
  }
  const { error: saveLikeError } = await supabase
    .from("liked songs")
    .insert([{ song_id: songId, user_id: session.user.id, song_url: songUrl }]);

  if (saveLikeError) {
    return json({
      message: "error when saving song, try again",
      toastType: "failure",
    });
  }
  return json({ message: "song saved successfully", toastType: "success" });
};
