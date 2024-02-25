import { error, fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { stripe } from "$lib/server/stripe";
import { getProfile } from "$lib/server/getProfile";
export const prerender = false;
export const load: PageServerLoad = async ({
  locals: { getSession, supabase },
}) => {
  let stripeReady: boolean = false;
  const session = await getSession();

  if (!session) {
    throw redirect(303, "/");
  }
  const profile = await getProfile({ supabase, session });
  if (profile?.stripe_id) {
    try {
      const stripeAcc = await stripe.accounts.retrieve(profile.stripe_id);
      if (stripeAcc.details_submitted) {
        stripeReady = true;
      } else {
        stripeReady = false;
      }
    } catch (e: any) {
      // console.log(e);
      if (e.code === "account_invalid") {
        const { error: dbError } = await supabase.from("profiles").upsert({
          id: session?.user.id,
          stripe_id: null,
        });
        if (dbError) {
          throw error(
            500,
            `An error occured when removing your invalid account from our database: ${dbError.message}`
          );
        }
      }
      throw error(500, `An error occured: ${e.message}`);
    } finally {
      return { session, profile, stripeReady };
    }
  } else return { session, profile, stripeReady };
};

export const actions: Actions = {
  update: async ({ request, locals: { supabase, getSession, checkAuth } }) => {
    // const authCheck = await checkAuth();
    // if (authCheck == false) {
    //   await supabase.auth.signOut();
    //   throw fail(401);
    // }
    const formData = await request.formData();
    const fullName = formData.get("fullName") as string;
    const username = formData.get("username") as string;
    const website = formData.get("website") as string;
    const avatarUrl = formData.get("avatarUrl") as string;
    const session = await getSession();

    if (username.length < 1 || !session) {
      return fail(400);
    }
    //@ts-ignore
    const { error } = await supabase.from("profiles").upsert({
      id: session?.user.id,
      full_name: fullName,
      username,
      website,
      avatar_url: avatarUrl,
      updated_at: new Date(),
    });
    if (error) {
      let isNameDuplicate = error.message.includes("duplicate");
      return fail(500, {
        fullName,
        username,
        website,
        avatarUrl,
        isUsernameTaken: isNameDuplicate ? true : false,
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
