import { error, fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { stripe } from "$lib/server/stripe";
export const load: PageServerLoad = async ({
  locals: { supabase, getSession },
  url,
}) => {
  const checkoutId = url.searchParams.get("session_id");
  const linkId = url.searchParams.get("account_link");
  const failed = url.searchParams.get("invalid");

  if (failed) {
    return {
      errMsg: "Failed to complete stripe donation or account link.",
    };
  }
  if (checkoutId) {
    const checkout = await stripe.checkout.sessions.retrieve(checkoutId);
    if (!checkout) return { errMsg: "Failed to find checkout with that ID." };
    return {
      payment: {
        payment_url: checkout.url,
        payment_status: checkout.payment_status,
      },
    };

    // return details of checkout to page.svelte
  }

  if (linkId) {
    // check
    const newAcc = await stripe.accounts.retrieve(linkId);
    if (newAcc.details_submitted) {
      return {
        link_success: true,
      };
    } else {
      return {
        link_success: false,
      };
    }
  }

  return {
    errMsg: "no param",
  };
};
