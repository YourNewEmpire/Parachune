import { stripe } from "$lib/server/stripe";
import { json } from "@sveltejs/kit";

export const GET = async ({}) => {
  // perhaps check if stripe_id exists
  const paymentIntents = await stripe.paymentIntents.list({
    limit: 100,
  });
  return json(paymentIntents.data);
};
