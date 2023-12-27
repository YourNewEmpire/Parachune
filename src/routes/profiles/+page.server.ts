import type { PageServerLoad } from "./$types";

export const prerender = true;

export const load: PageServerLoad = async ({
  locals: { supabase },
  parent,
}) => {
  const { data: profileList, error: dbError } = await supabase
    .from("profiles")
    .select(`username, avatar_url, id`)
    .not("username", "is", null);
  const { profile, session } = await parent();
  return { profileList, profile, session };
};
