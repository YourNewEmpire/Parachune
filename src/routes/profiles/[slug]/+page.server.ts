import { error, fail, redirect } from "@sveltejs/kit";
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
  let artistProfile: Profile;
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select()
    .eq("username", params.slug)
    .not("username", "is", "null")
    .single();
  if (!profileData) {
    return {};
  }
  const { data: artistSongs, error: songsError } = await supabase
    .from("songs")
    .select(`name, song_url, id`)
    .eq("artist", profileData.username);
  artistProfile = { ...profileData };

  return { artistProfile, artistSongs };
};
