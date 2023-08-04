import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({
  locals: { supabase, getSession, getProfile },
}) => {
  const session = await getSession();
  const profile = await getProfile();
  let message;

  if (!session) {
    message = `Welcome newcomer. This project is a music app. You can listen to music right now, or create an account and upload your own (donations coming soon). 
      Click the button below to begin your artist journey`;
  } else {
    message = `Welcome back ${
      profile?.username ?? session?.user.email
    }. This project is a music app. You can listen to music right now, or create an account and upload your own (donations coming soon). 
  Navigate to My Account to start uploading music.`;
  }
  return {
    message,
  };
};
