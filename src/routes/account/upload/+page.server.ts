import { fail, redirect } from "@sveltejs/kit";
import { v4 as uuidv4 } from "uuid";
import type { Actions, PageServerLoad } from "./$types";
export const prerender = false;

export const load: PageServerLoad = async ({
  locals: { getSession, supabase },
}) => {
  const session = await getSession();
  if (!session) {
    throw redirect(303, "/");
  }

  const { data: albumData, error: albumError } = await supabase
    .from("albums")
    .select("*")
    .eq("artist_id", session.user.id);

  return { albumData };
};

export const actions: Actions = {
  uploadSong: async ({ request, locals: { supabase, getSession } }) => {
    const session = await getSession();
    if (!session) {
      return fail(400, {
        message: "Please login",
      });
    }
    const formData = await request.formData();
    const songFile = formData.get("song") as File;
    const songName = formData.get("songName") as string;
    const songAlbum = formData.get("songAlbum") as string;

    // Validate form
    if (songName.length < 1) {
      return fail(400);
    }
    if (songFile.size < 1) {
      return fail(400);
    }
    if (songAlbum.length < 1) {
      return fail(400);
    }
    // Prepare song file
    const fileExt = songFile.name.split(".").pop();
    let uId = uuidv4();
    let url = `${uId}.${fileExt}`;

    //? Upload and insert to supabase
    const { data, error } = await supabase.storage
      .from("songs")
      .upload(url, songFile);
    if (error) {
      // console.log(error);
      return fail(400);
    }
    const { data: dbData, error: dbError } = await supabase
      .from("songs")
      .insert([
        {
          name: songName,
          artist_id: session.user.id,
          song_url: url,
          album_id: songAlbum,
        },
      ]);
    if (dbError) {
      // console.log(dbError);
      return fail(400);
    }
    //? No errors were caught, so return good
    return {
      message: "Song complete, check Music",
    };
  },

  createAlbum: async ({ request, locals: { supabase, getSession } }) => {
    const session = await getSession();
    if (!session) {
      return fail(400, {
        message: "Please login",
      });
    }

    const formData = await request.formData();
    const albumName = formData.get("albumName") as string;
    const albumImage = formData.get("albumImage") as File;
    const albumType = formData.get("albumType") as string;
    const albumGenre = formData.get("albumGenre") as string;
    if (albumName.length < 1) {
      return fail(400);
    }
    if (albumImage.size < 1) {
      return fail(400);
    }
    // Prepare song file
    const fileExt = albumImage.name.split(".").pop();
    let uId = uuidv4();
    let url = `${uId}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from("album-images")
      .upload(url, albumImage);
    if (error) {
      // console.log(error);
      return fail(400);
    }
    const { data: dbData, error: dbError } = await supabase
      .from("albums")
      .insert([
        {
          title: albumName,
          artist_id: session.user.id,
          image_url: url,
          is_single: albumType === "single" ? true : false,
          genre: albumGenre,
        },
      ])
      .select();
    if (dbError) {
      // console.log(dbError);
      return fail(400);
    }
    console.log(dbData);
    //? No errors were caught, so return good
    return {
      message: "Album complete, go upload to it.",
      newAlbum: dbData[0],
    };
  },
};
