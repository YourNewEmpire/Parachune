import { fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({
  locals: { supabase },
  parent,
}) => {
  const { data: songData, error: songError } = await supabase
    .from("songs")
    .select("*, profiles(username)")
    .range(0, 4);

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select(`*`)
    .range(0, 4)
    .not("username", "is", null);

  if (songError || profileError) {
    fail(500, {
      songError,
      profileError,
    });
  }
  //@ts-ignore
  //? So hard to type the data from supabase db fetch. Need to generate types from db.

  return { songData, profileData };
};
