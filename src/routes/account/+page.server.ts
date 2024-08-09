import { error, fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { stripe } from "$lib/server/stripe";
import { getProfile } from "$lib/server/getProfile";
import { invalidate } from "$app/navigation";

export const prerender = false;

export const load: PageServerLoad = async ({
  locals: { getSession, supabase, checkAuth },
}) => {
  let stripeReady: boolean = false;

  const authCheck = await checkAuth();
  if (!authCheck) {
    invalidate("supabase:auth");
    throw redirect(401, "/");
  }

  const session = await getSession();
  if (!session) {
    throw redirect(401, "/");
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
    const authCheck = await checkAuth();
    if (authCheck == false) {
      invalidate("supabase:auth");
      await supabase.auth.signOut();
      throw error(401);
    }
    const formData = await request.formData();
    const username = formData.get("username") as string;
    const fullName = formData.get("fullName") as string;
    const website = formData.get("websiteUrl") as string;
    const avatarUrl = formData.get("avatarUrl") as string;
    const socialMediaPrefix = "social_";
    const socialMediaUpsert: { [key: string]: string } = {};

    for (let [key, value] of formData.entries()) {
      if (key.startsWith(socialMediaPrefix)) {
        const socialMediaKey = key.slice(socialMediaPrefix.length); // Remove the prefix
        socialMediaUpsert[socialMediaKey] = value as string;
      }
    }
    console.log(socialMediaUpsert);
    // const updateSchema = zfd.formData({
    //   commentId: zfd.text(),
    //   commentIndex: zfd.text(),
    //   commentPrivate: zfd.text(),
    //   commentText: zfd.text(),
    // });
    // const result = updateSchema.safeParse(formData);
    // if (!result.success) {
    //   return fail(400);
    // }

    //? dont really need session for upsert but makes sure and no issue doing it, paranoia more than anythingtbh.
    const session = await getSession();
    if (username.length < 1) {
      return fail(400, {
        fullName,
        username,
        website,
        avatarUrl,
        isUsernameShort: true,
      });
    }
    if (!session) {
      return fail(400, {
        fullName,
        username,
        website,
        avatarUrl,
        isAuth: false,
      });
    }
    //@ts-ignore
    const { error: profileUpError } = await supabase.from("profiles").upsert({
      id: session?.user.id,
      full_name: fullName,
      username,
      website,
      avatar_url: avatarUrl,
      social_media_urls: socialMediaUpsert,
      updated_at: new Date(),
    });

    if (profileUpError) {
      let isNameDuplicate = profileUpError.message.includes("duplicate");
      return fail(500, {
        fullName,
        username,
        website,
        avatarUrl,
        social_media_urls: socialMediaUpsert,
        isUsernameTaken: isNameDuplicate ? true : false,
      });
    }

    return {
      success: true,
      fullName,
      username,
      website,
      avatarUrl,
      social_media_urls: socialMediaUpsert,
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
