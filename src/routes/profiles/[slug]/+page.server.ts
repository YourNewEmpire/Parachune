import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

type Profile = {
  username: string;
  avatar_url: string;
  paypal_id: string;
};
type SongRow = {
  name: string | null;
  song_url: string | null;
};
export const load: PageServerLoad = async ({
  locals: { supabase, getSession },
  params,
}) => {
  const session = await getSession();
  if (!session) {
    redirect(301, "/login");
  }
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select()
    .eq("username", params.slug)
    .single();

  const { data: artistSongs, error: songsError } = await supabase
    .from("songs")
    .select(`name, song_url`)
    .eq("artist", profileData.username);
  const artistProfile: Profile = { ...profileData };

  return { artistProfile, artistSongs };
};
