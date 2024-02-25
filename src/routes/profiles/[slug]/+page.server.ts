import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { stripe } from "$lib/server/stripe";

export const load: PageServerLoad = async ({
  locals: { supabase },
  params,
  parent,
}) => {
  // vars to be set and returned. stripeReady is for UI to render stripe donation for the artist accordingly
  let stripeReady: boolean;

  const { data: artistProfile, error: profileError } = await supabase
    .from("profiles")
    .select(`*, albums(title, id, image_url), songs(*)`)
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
  if (!artistProfile) {
    throw error(500, {
      message:
        "We couldn't get data for this artist, please try again or contact.",
    });
  }

  if (artistProfile.stripe_id) {
    try {
      const stripeAcc = await stripe.accounts.retrieve(artistProfile.stripe_id);
      if (stripeAcc.details_submitted) {
        stripeReady = true;
      } else {
        stripeReady = false;
      }
    } catch (e: any) {
      throw error(500, `An error occured: ${e.message}`);
    }
  } else {
    stripeReady = false;
  }

  return { artistProfile, stripeReady };
};
