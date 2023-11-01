import type { RequestHandler } from "./$types";
import { stripe } from "$lib/server/stripe";
import { json } from "@sveltejs/kit";

export const POST: RequestHandler = async ({
  request,
  url,
  locals: { getSession },
}) => {
  const session = await getSession();
  if (!session) {
    return json({ message: "not logged in", toastType: "failure" });
  }
  const reqData = await request.json();

  // perhaps check if stripe_id exists
  const stripeCheckout = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price: "price_1O03pgLd5vjpFt5S89OwdsQf",
        quantity: 1,
      },
    ],
    payment_intent_data: {
      transfer_data: {
        destination: reqData.stripe_id,
      },
    },
    success_url: import.meta.env.DEV
      ? "http://localhost:5223/stripe-status?session_id={CHECKOUT_SESSION_ID}"
      : "https://parachune.vercel.app/stripe-status?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: url.origin,
  });

  return json(stripeCheckout.url);
};
