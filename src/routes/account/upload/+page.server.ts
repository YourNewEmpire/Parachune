import { fail, redirect } from "@sveltejs/kit";
import { v4 as uuidv4 } from "uuid";
import type { Actions, PageServerLoad } from "./$types";
export const load: PageServerLoad = async ({
  locals: { getSession, getProfile },
}) => {
  const session = await getSession();
  const profile = await getProfile();
  if (!session) {
    throw redirect(303, "/login");
  }

  return { session, profile };
};

export const actions = {
  uploadSong: async ({ request, locals: { supabase, getProfile } }) => {
    const profile = await getProfile();
    if (!profile) {
      return fail(400, {
        message: "Please login",
      });
    }
    const formData = await request.formData();
    const songFile = formData.get("song") as File;
    const songName = formData.get("songName") as string;

    // Validate form
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

    // Prepare song file
    const fileExt = songFile.name.split(".").pop();
    let uId = uuidv4();
    let url = `${songName.split(" ").join("") + uId}.${fileExt}`;

    // //? Upload and insert to supabase
    const { data, error } = await supabase.storage
      .from("songs")
      .upload(url, songFile);
    if (error) {
      // console.log(error);
      return fail(400, { message: "Failed to set DB entry, try again." });
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
      // console.log(dbError);
      return fail(400, { message: "Failed to set DB entry, try again." });
    }
    //? No errors were caught, so return good
    return {
      message: "Song complete, check Your Music",
    };
  },
} satisfies Actions;
