import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request, locals: { supabase, getSession } }) => {
  const session = await getSession();
  if (!session) {
    return json({ message: "not logged in" });
  }
  let currentSaved;
  const { songId } = await request.json();

  const { data: savedSongs, error: savedSongsError } = await supabase
    .from("profiles")
    .select("saved_songs")
    .eq("id", session.user.id);
  if (savedSongsError) {
    return json({
      message: "error when collecting your profile name, try again",
    });
  }
  if (savedSongs) {
    currentSaved = savedSongs[0].saved_songs;
  }
  if (currentSaved.includes(songId)) {
    return json({ message: "Song already liked" });
  }
  //? when song id is already amongst current songs, duplication can be avoided by spreading a set here.
  let newSongs = [...currentSaved, songId];

  const { data: saveSong, error: saveError } = await supabase
    .from("profiles")
    .update({
      saved_songs: newSongs,
    })
    .eq("id", session.user.id);

  if (saveError) return json({ message: "error when saving song, try again" });
  return json({ message: "song saved successfully" });
  //return json(a + b);
}) satisfies RequestHandler;
