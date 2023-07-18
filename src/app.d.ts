// src/app.d.ts

import { SupabaseClient, Session } from "@supabase/supabase-js";

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient;
      getSession(): Promise<Session | null>;
      getProfile(): Promise<{
        username: any;
        full_name: any;
        website: any;
        avatar_url: any;
      } | null>;
    }
    interface PageData {
      session: Session | null;
    }

    // interface Error {}
    // interface Platform {}
  }
}
