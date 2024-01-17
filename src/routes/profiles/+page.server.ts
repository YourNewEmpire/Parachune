import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({
  locals: { supabase },
  parent,
}) => {
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
  const { profile, session } = await parent();
  return { profileList, profile, session };
};
