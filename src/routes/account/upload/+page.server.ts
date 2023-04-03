import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

type SongRow = {
  artist: string | null;
  created_at: string | null;
  id: number;
  name: string | null;
  song_url: string | null;
};

export const load = (async ({ locals: { supabase, getSession } }) => {
  const session = await getSession();

  if (!session) {
    throw redirect(303, "/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select(`username, full_name, website, avatar_url`)
    .eq("id", session.user.id)
    .single();

  return { session, profile };
}) satisfies PageServerLoad;

export const actions = {
  uploadSong: async ({ request, locals: { supabase, getSession } }) => {
    const session = await getSession();
    const { data: profile } = await supabase
      .from("profiles")
      .select(`username`)
      .eq("id", session?.user.id)
      .single();
    const formData = await request.formData();
    const songFile = formData.get("song") as File;
    const songName = formData.get("songName") as string;
    if (songName.length < 1) {
      return fail(400, {
        message: "Song name too short, at least 1 char please",
      });
    }
    if (songFile.size < 1) {
      return fail(400, {
        message: "Please atttach a file",
      });
    }
    const fileExt = songFile.name.split(".").pop();
    let url = `${songName}.${fileExt}`;
    // //? Upload and insert to supabase
    const { data, error } = await supabase.storage
      .from("songs")
      .upload(url, songFile);
    if (error) {
      console.log(error);
      return {
        message: "Error when attempting upload to storage bucket, try again",
      };
    }
    const { data: dbData, error: dbError } = await supabase
      .from("songs")
      .insert([
        {
          name: songName,
          artist: profile?.username,
          song_url: url,
        },
      ]);
    if (dbError) {
      console.log(dbError);
      return fail(400, { message: "Failed to set DB entry, try again." });
    }
    //? No errors were caught, so return good
    return {
      message: "Song complete, check Your Music",
    };
  },
} satisfies Actions;
