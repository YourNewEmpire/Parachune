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

  if (!profile) {
    throw redirect(303, "/");
  }
  const { data: dbFetch, error: dbError } = await supabase
    .from("songs")
    .select(`artist, name, song_url, created_at`)
    .eq("artist", profile?.username);
  //@ts-ignore
  //? So hard to type the data from supabase db fetch. Need help tbh.
  let dbData: SongRow[] = [].concat(dbFetch);
  return { session, profile, dbData };
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
    const fileExt = songFile.name.split(".").pop();
    let url = `${songName}.${fileExt}`;

    const { data, error } = await supabase.storage
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

    if (error || dbError) {
      console.log(error);
      console.log(dbError);
      return {
        success: false,
      };
    }
    return {
      success: true,
    };
  },
} satisfies Actions;
