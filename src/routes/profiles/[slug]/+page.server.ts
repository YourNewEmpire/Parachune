import { error, fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

type Profile = {
  username: string;
  avatar_url: string;
  stripe_id: string;
};

export const load: PageServerLoad = async ({
  locals: { supabase },
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
    // todo - needs fixing
    return {};
  }
  const { data: artistSongs, error: songsError } = await supabase
    .from("songs")
    .select(`name, song_url, id`)
    .eq("artist", profileData.username);
  artistProfile = { ...profileData };

  return { artistProfile, artistSongs };
};
