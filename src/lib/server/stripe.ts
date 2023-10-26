// in src/lib/server/stripe.js
import Stripe from "stripe";
// export the stripe instance
export const stripe = new Stripe(import.meta.env.VITE_STRIPE_DEV, {
  apiVersion: "2023-10-16",
});
