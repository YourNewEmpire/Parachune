import { getProfile } from "$lib/server/getProfile";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({
  locals: { supabase },
  parent,
}) => {
  const { session } = await parent();
  const profile = await getProfile({ supabase, session });
  let message;
  if (!session) {
    message = `Welcome, to Parachune. Parachute your tunes here, for free. Scroll to learn more.`;
  } else {
    message = `Welcome back ${
      profile?.username ?? session?.user.email
    }. Good to see you.`;
  }

  return {
    message,
  };
};
