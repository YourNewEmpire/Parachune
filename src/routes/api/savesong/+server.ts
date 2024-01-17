import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({
  request,
  locals: { supabase, getSession },
}) => {
  const session = await getSession();
  if (!session) {
    return json({ message: "not logged in", toastType: "failure" });
  }
  const { songId, songUrl, unSave } = await request.json();

  if (unSave) {
    const { error: songUnsaveErr } = await supabase
      .from("saved songs")
      .delete()
      .eq("song_id", songId);
    if (songUnsaveErr) {
      return json({
        message: "Error removing, try again or contact the dev",
        toastType: "failure",
      });
    }
    return json({ message: "Song removed", toastType: "success" });
  }
  //? Search for song id in likes. If it already exists, quit
  const { data: saveData, error: saveDataError } = await supabase
    .from("saved songs")
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
    .from("saved songs")
    .insert([{ song_id: songId, user_id: session.user.id, song_url: songUrl }]);

  if (saveLikeError) {
    return json({
      message: "error when saving song, try again",
      toastType: "failure",
    });
  }
  return json({ message: "song saved successfully", toastType: "success" });
};
