import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
  const { profile, session } = await parent();
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
