import type { RequestHandler } from "./$types";
import { stripe } from "$lib/server/stripe";
import { json } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, url }) => {
  // perhaps check if stripe_id exists
  const stripeCheckout = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price: "price_1OpDzgLd5vjpFt5SwveP2Kcu",
        quantity: 1,
      },
    ],
    success_url: import.meta.env.DEV
      ? "http://localhost:5223/stripe-status?session_id={CHECKOUT_SESSION_ID}"
      : "https://parachune.vercel.app/stripe-status?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: url.origin,
  });
  return json(stripeCheckout.url);
};
