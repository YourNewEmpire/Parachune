import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({
  locals: { supabase, getSession },
}) => {
  const session = await getSession();
  let message;
  if (!session) {
    message = `Welcome newcomer. This project is a spotify clone, where you create an account, upload for free, and can donate to eachother. 
      Click the button below to begin your music journey`;
  }
  const { data: profile } = await supabase
    .from("profiles")
    .select(`username, full_name, website, avatar_url`)
    .eq("id", session?.user.id)
    .single();
  message = `Welcome ${
    profile?.username ?? session?.user.email
  }. This project is a spotify clone, where you create an account, upload for free, and can donate to eachother. 
  Navigate to Account to start uploading music.`;
  return {
    message,
  };
};
