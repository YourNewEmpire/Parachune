import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({
  locals: { supabase, getSession, getProfile },
}) => {
  const session = await getSession();
  const profile = await getProfile();
  let message;

  if (!session) {
    message = `Welcome newcomer. This project is a spotify clone. you can upload songs for free, (donations coming soon). 
      Click the button below to begin your music journey`;
  } else {
    message = `Welcome back ${
      profile?.username ?? session?.user.email
    }. This project is a spotify clone, where you create an account, upload songs for free, (donations coming soon). 
  Navigate to Your Profile to start uploading music.`;
  }
  return {
    message,
  };
};
