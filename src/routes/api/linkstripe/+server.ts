import { error, json, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { stripe } from "$lib/server/stripe";

export const POST: RequestHandler = async ({
  locals: { getSession, supabase, getProfile },
  url,
}) => {
  const session = await getSession();

  if (!session) {
    return json({ message: "not logged in", toastType: "failure" });
  }

  const account = await stripe.accounts.create({
    type: "express",
  });

  if (!account) {
    throw error(404, "Error when creating express account");
  }

  const { error: sbError } = await supabase
    .from("profiles")
    .upsert({
      stripe_id: account.id,
    })
    .eq("user_id", session.user.id);

  if (sbError) {
    throw error(404, `Error when syncing to database ${sbError.message}`);
  }

  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: url.origin,
    // todo - remove SB code from here and put in load function of stripe-status, checking that it exists.
    return_url: import.meta.env.DEV
      ? `http://localhost:5223/stripe-status?account_link=${account.id}`
      : `https://parachune.vercel.app/stripe-status?account_link=${account.id}`,
    type: "account_onboarding",
  });

  if (!accountLink) {
    const { error: sbDelErr } = await supabase
      .from("profiles")
      .upsert({ stripe_id: null })
      .eq("user_id", session.user.id);

    if (sbDelErr) {
      throw error(404, "Error when linking express account and deleting");
    }
    throw error(404, "Error when linking express account");
  }

  return json(accountLink);
};
