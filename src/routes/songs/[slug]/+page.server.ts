import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

type Profile = {
  username: string;
  avatar_url: string;
  paypal_id: string;
};
type SongRow = {
  name: string | null;
  song_url: string | null;
};
export const load: PageServerLoad = async ({
  locals: { supabase },
  params,
}) => {
  const { data: songData, error: songError } = await supabase
    .from("songs")
    .select(`artist, name, song_url, created_at, id, profiles ( avatar_url)`)
    .eq("name", params.slug)
    .single();

  return { songData };
};
