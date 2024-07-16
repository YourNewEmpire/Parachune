import { SupabaseClient, Session } from "@supabase/supabase-js";
import { Database } from "./types/DbDefinitions";
declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient<Database>;
      checkAuth(): Promise<Boolean>;
      getSession(): Promise<Session | null>;
      safeGetSession(): Promise<
        { session: null; user: null } | { session: Session; user: User | null }
      >;
    }
    interface PageData {
      session: Session | null;
      // profile: {
      //   username: any;
      //   full_name: any;
      //   website: any;
      //   avatar_url: any;
      //   stripe_id: any;
      // } | null;
    }

    // interface Error {}
    // interface Platform {}
  }
}
