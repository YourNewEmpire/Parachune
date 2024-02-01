import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({
  locals: { supabase },
  params,
  parent,
}) => {
  const { data: songData, error: songDataErr } = await supabase
    .from("songs")
    .select(`*, profiles (id, avatar_url, username)`)
    .eq("id", params.slug)
    .single();

  if (songDataErr) {
    throw error(404, {
      message: "Song not found",
    });
  }

  const { profile, session } = await parent();
  return { song: songData, profile, session };
};
