import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, locals: { getSession } }) => {
  const session = await getSession();

  // if the user is already logged in return them to the account page
  if (session) {
    throw redirect(303, "/account");
  }

  return { url: url.origin };
};
// src/routes/login/+page.server.js
export const actions = {
  withEmail: async ({ request, url, locals: { supabase } }) => {
    const formData = await request.formData();
    const emailInput = formData.get("email") as string;

    const { error } = await supabase.auth.signInWithOtp({
      email: emailInput,
      options: {
        emailRedirectTo: `${url.origin}/auth/callback`,
      },
    });
    if (error) {
      return fail(500, {
        email: emailInput,
      });
    }

    return {
      success: true,
    };
  },
  withGoogle: async ({ request, url, locals: { supabase } }) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${url.origin}/auth/callback`,
        scopes:
          "openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
      },
    });
    if (error) {
      console.log("how is there an error");
      return fail(500, {
        message: error.message,
      });
    } else {
      throw redirect(303, data.url);
    }
  },
} satisfies Actions;
