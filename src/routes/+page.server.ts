import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({
  locals: { supabase, getSession, getProfile },
}) => {
  const session = await getSession();
  const profile = await getProfile();
  let message;
  if (!session) {
    message = `Welcome newcomer. This project is a spotify clone. you can upload songs for free, and can donate to eachother. 
      Click the button below to begin your music journey`;
  }

  message = `Welcome ${
    profile?.username ?? session?.user.email ?? "Newcomer"
  }. This project is a spotify clone, where you create an account, upload songs for free, and can donate to eachother. 
  Navigate to Account to start uploading music.`;
  return {
    message,
  };
};
