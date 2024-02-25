import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  const { data: profileList, error: dbError } = await supabase
    .from("profiles")
    .select(`username, avatar_url, id`)
    .not("username", "is", null);
  if (dbError) {
    throw error(
      500,
      `Error getting profiles data, message: ${dbError.message}`
    );
  }
  return { profileList };
};
