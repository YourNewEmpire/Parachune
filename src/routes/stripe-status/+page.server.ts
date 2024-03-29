import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { stripe } from "$lib/server/stripe";
import type Stripe from "stripe";
import type { Session } from "@supabase/supabase-js";
import { getProfile } from "$lib/server/getProfile";
import type { Database } from "../../types/DbDefinitions";

type StripeStatus = {
  errMsg: string | null;
  paymentStatus: Stripe.Checkout.Session.PaymentStatus | null;
  linkSuccess: boolean | null;
  session: Session;
  profile: Database["public"]["Tables"]["profiles"]["Row"] | null;
};

export const load: PageServerLoad = async ({
  locals: { getSession, supabase },
  url,
}) => {
  const session = await getSession();
  if (!session) {
    return error(500, "Error, no user session");
  }

  let ret: StripeStatus = {
    errMsg: null,
    paymentStatus: null,
    linkSuccess: null,
    session: session,
    profile: null,
  };
  const checkoutId = url.searchParams.get("session_id");
  const linkId = url.searchParams.get("account_link");

  if (checkoutId) {
    const checkout = await stripe.checkout.sessions.retrieve(checkoutId);
    if (!checkout) {
      throw error(404, "checkout link not found");
    }
    ret.paymentStatus = checkout.payment_status;
  } else if (linkId) {
    // check
    const newAcc = await stripe.accounts.retrieve(linkId);
    if (newAcc.details_submitted) {
      ret.linkSuccess = true;
    } else {
      ret.linkSuccess = false;
    }
  } else {
    throw error(404, `🧭 Nothing found here, sorry`);
  }
  const profile = await getProfile({ supabase, session });

  ret.profile = profile;
  return ret;
};
