import { error, json, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { stripe } from "$lib/server/stripe";

export const POST: RequestHandler = async ({
  locals: { getSession, supabase },
}) => {
  const session = await getSession();

  if (!session) {
    throw error(
      404,
      "Error when looking for user session, try logging in or re-logging"
    );
  }
  //todo - check if they already have an account id from before but didnt onboard it, saves creating a fresh account and rewriting it.
  const account = await stripe.accounts.create({
    type: "express",
  });

  if (!account) {
    throw error(404, "Error when creating express account");
  }

  const { error: sbError } = await supabase
    .from("profiles")
    .upsert({
      id: session.user.id,
      stripe_id: account.id,
    })
    .eq("user_id", session?.user.id);

  if (sbError) {
    throw error(
      404,
      "Error when syncing express stripe account to database profile"
    );
  }

  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: import.meta.env.DEV
      ? `http://localhost:5223/account`
      : `https://parachune.vercel.app/account`,
    // todo - remove SB code from here and put in load function of stripe-status, checking that it exists.
    return_url: import.meta.env.DEV
      ? `http://localhost:5223/stripe-status?account_link=${account.id}`
      : `https://parachune.vercel.app/stripe-status?account_link=${account.id}`,
    type: "account_onboarding",
  });

  return json(accountLink);
};
