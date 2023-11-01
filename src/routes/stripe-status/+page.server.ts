import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { stripe } from "$lib/server/stripe";
import type Stripe from "stripe";

type StripeStatus = {
  errMsg: string | null;
  payment: {
    url: string | null;
    status: Stripe.Checkout.Session.PaymentStatus | null;
  };
  linkSuccess: boolean | null;
};

export const load: PageServerLoad = async ({ locals: { getSession }, url }) => {
  const session = await getSession();
  if (!session) {
    return error(500, "Error, no user session");
  }

  let ret: StripeStatus = {
    errMsg: null,
    payment: {
      status: null,
      url: null,
    },
    linkSuccess: null,
  };
  const checkoutId = url.searchParams.get("session_id");
  const linkId = url.searchParams.get("account_link");
  const failed = url.searchParams.get("invalid");

  if (failed) {
    ret.errMsg = "Failed to complete stripe donation or account link.";
  }

  if (checkoutId) {
    const checkout = await stripe.checkout.sessions.retrieve(checkoutId);
    if (!checkout) return { errMsg: "Failed to find checkout with that ID." };

    ret.payment = {
      url: checkout.url ?? "",
      status: checkout.payment_status,
    };
  }

  if (linkId) {
    // check
    const newAcc = await stripe.accounts.retrieve(linkId);
    if (newAcc.details_submitted) {
      ret.linkSuccess = true;
    } else {
      ret.linkSuccess = false;
    }
  }

  return ret;
};
