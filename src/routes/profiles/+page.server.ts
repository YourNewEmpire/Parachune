import { fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  const { data: profileList, error: dbError } = await supabase
    .from("profiles")
    .select(`username, avatar_url`);

  return { profileList };
};
