import { error, fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { stripe } from "$lib/server/stripe";
export const load: PageServerLoad = async ({
  locals: { getSession, getProfile },
}) => {
  let stripeReady: boolean = false;
  const session = await getSession();
  const profile = await getProfile();

  if (!session) {
    throw redirect(303, "/login");
  }

  if (profile?.stripe_id) {
    try {
      const stripeAcc = await stripe.accounts.retrieve(profile.stripe_id);
      if (stripeAcc.details_submitted) {
        stripeReady = true;
      } else {
        stripeReady = false;
      }
    } catch (e: any) {
      throw error(500, `An error occured: ${e.message}`);
    }
  }

  return { session, profile, stripeReady };
};

export const actions: Actions = {
  update: async ({ request, locals: { supabase, getSession } }) => {
    const formData = await request.formData();
    const fullName = formData.get("fullName") as string;
    const username = formData.get("username") as string;
    const website = formData.get("website") as string;
    const avatarUrl = formData.get("avatarUrl") as string;
    const session = await getSession();

    const { error } = await supabase.from("profiles").upsert({
      id: session?.user.id,
      full_name: fullName,
      username,
      website,
      avatar_url: avatarUrl,
      updated_at: new Date(),
    });

    if (error) {
      return fail(500, {
        fullName,
        username,
        website,
        avatarUrl,
      });
    }

    return {
      success: true,
      fullName,
      username,
      website,
      avatarUrl,
    };
  },
  signout: async ({ locals: { supabase, getSession } }) => {
    const session = await getSession();
    if (session) {
      await supabase.auth.signOut();
      throw redirect(303, "/");
    }
  },
};
