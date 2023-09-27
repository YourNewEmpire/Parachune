import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

type Profile = {
  username: string;
  avatar_url: string;
  paypal_id: string;
};

export const load: PageServerLoad = async ({
  locals: { supabase, getSession },
  params,
}) => {
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select()
    .eq("username", params.slug)
    .single();

  const { data: artistSongs, error: songsError } = await supabase
    .from("songs")
    .select(`name, song_url, id`)
    .eq("artist", profileData.username);
  const artistProfile: Profile = { ...profileData };

  return { artistProfile, artistSongs };
};
