import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({
  locals: { getSession, getProfile },
}) => {
  const session = await getSession();
  const profile = await getProfile();
  let message;
  if (!session) {
    message = `Welcome newcomer, to Parachune. Parachute your tunes here, for free. Click below to login,  or scroll to learn more about Parachune.`;
  } else {
    message = `Welcome back ${
      profile?.username ?? session?.user.email
    }. We are happy you're back here.`;
  }
  return {
    profile,
    message,
    session,
  };
};
