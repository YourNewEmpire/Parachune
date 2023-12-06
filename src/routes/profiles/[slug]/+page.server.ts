import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { stripe } from "$lib/server/stripe";

type Profile = {
  username: string;
  avatar_url: string;
  stripe_id: string;
};

export const load: PageServerLoad = async ({
  locals: { supabase },
  params,
  parent,
}) => {
  // vars to be set and returned. stripeReady is for UI to render stripe donation for the artist accordingly
  let artistProfile: Profile;
  let stripeReady: boolean;

  //
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select()
    .eq("id", params.slug)
    .not("username", "is", "null")
    .single();

  // handle no data or errors
  if (profileError) {
    throw error(500, {
      message:
        profileError?.message ??
        "There was an unknown error getting this profile",
    });
  }
  if (!profileData) {
    throw error(500, {
      message:
        "We couldn't get data for this artist, please try again or contact.",
    });
  }

  if (profileData.stripe_id) {
    const stripeAcc = await stripe.accounts.retrieve(profileData.stripe_id);
    if (!stripeAcc) {
      stripeReady = false;
    }
    if (stripeAcc.details_submitted) {
      stripeReady = true;
    } else {
      stripeReady = false;
    }
  } else {
    stripeReady = false;
  }

  const { data: artistSongs, error: songsError } = await supabase
    .from("songs")
    .select(`name, song_url, id`)
    .eq("artist", profileData.username);

  artistProfile = { ...profileData };

  const { profile, session } = await parent();

  return { artistProfile, artistSongs, profile, session, stripeReady };
};
