import type { Session, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../types/DbDefinitions";

type getProfileArgs = {
  session: Session | null;
  supabase: SupabaseClient<Database>;
};

export const getProfile = async ({ supabase, session }: getProfileArgs) => {
  if (!supabase || !session) {
    return null;
  }

  try {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select(`*`)
      .eq("id", session?.user.id)
      .single();
    if (profile) return profile;
  } catch (error) {
    return null;
  }
  return null;
};
