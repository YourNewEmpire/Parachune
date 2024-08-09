// in src/lib/server/stripe.js
import Stripe from "stripe";
// export the stripe instance
export const stripe = new Stripe(
  import.meta.env.DEV
    ? import.meta.env.VITE_STRIPE_DEV
    : import.meta.env.VITE_STRIPE_PROD,
  {
    apiVersion: "2024-06-20",
  }
);
