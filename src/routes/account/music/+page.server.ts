import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

type SongRow = {
  artist_id: number;
  created_at: string | null;
  id: number;
  name: string | null;
  song_url: string | null;
};

export const prerender = false;

export const load: PageServerLoad = async ({
  locals: { supabase, getSession },
}) => {
  const session = await getSession();
  if (!session) {
    throw redirect(303, "/");
  }

  const { data: dbFetch, error: dbError } = await supabase
    .from("songs")
    .select(`artist_id, name, song_url, created_at, id`)
    .eq("artist_id", session.user.id);
  //@ts-ignore
  //? So hard to type the data from supabase db fetch. Need help tbh.
  let dbData: SongRow[] = [].concat(dbFetch);
  return { session, dbData };
};

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
    const fileExt = songFile.name.split(".").pop();
    let url = `${songName}.${fileExt}`;

    const { error: storageError } = await supabase.storage
      .from("songs")
      .upload(url, songFile);
    const { data: dbData, error: dbError } = await supabase
      .from("songs")
      .insert([
        {
          name: songName,
          artist: profile?.username,
          song_url: url,
        },
      ]);

    if (storageError || dbError) {
      // console.log(storageError);
      // console.log(dbError);
      return fail(400, { message: "Error, try again" });
    }
    return {
      success: true,
    };
  },
} satisfies Actions;
