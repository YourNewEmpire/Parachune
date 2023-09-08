import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals: { supabase }, url }) => {
  //? get the skip (from) and limit (to) from search params or use defaults.
  const limit = Number(url.searchParams.get("limit")) || 10;
  const skip = Number(url.searchParams.get("skip")) || 0;

  //
  const { count: songCount, error: songCountError } = await supabase
    .from("songs")
    .select("*", { count: "exact", head: true });
  const { data: songList, error: songErr } = await supabase
    .from("songs")
    .select(
      `artist, name, song_url, created_at, id, profiles (avatar_url, username)`
    )
    .order("created_at", { ascending: false })
    .range(skip, limit - 1);

  return { songList, totalSongs: songCount };
};
