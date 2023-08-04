<script lang="ts">
  import type { SubmitFunction } from "@sveltejs/kit";
  import type { PageData } from "./$types";
  import { enhance } from "$app/forms";
  import { Icon, PaperAirplane, InformationCircle } from "svelte-hero-icons";
  import Googleicon from "$lib/googleicon.svelte";
  import type { Provider } from "@supabase/supabase-js";
  import { addToast } from "$lib/stores";

  export let data: PageData;
  export let form;
  $: ({ supabase, authProviders, url } = data);
  let loading = false;

  const handleSignIn: SubmitFunction = () => {
    loading = true;
    return async ({ update, result }) => {
      loading = false;
      addToast({
        type: "info",
        message:
          "Please check your email for a magic link to log into the website.",
        timeout: 5000,
        dismissable: true,
      });
      update();
    };
  };

  const _providerSignIn = async (provider: Provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${url}/auth/callback`,
        scopes:
          "openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
      },
    });
  };

  const handleSocialLogin: SubmitFunction = ({ action, cancel }) => {
    let providerParam = action.searchParams.get("provider") as Provider;
    if (authProviders.includes(providerParam)) {
      _providerSignIn(providerParam);
    }
    cancel();
  };
</script>

<svelte:head>
  <title>Login - Parachune</title>
</svelte:head>

<div>
  <h1>Login</h1>
  {#if data.session}
    <h1>You are logged in. Continue on this tab or on the new tab.</h1>
  {:else}
    <div class="card">
      <div class="row-container" style="justify-content: center;">
        <form method="POST" use:enhance={handleSignIn}>
          <div class="input-group">
            <div class="input-item">
              <label for="email"> Email</label>
              <input
                name="email"
                placeholder="VoodooChild@example"
                value={form?.email ?? ""}
              />
            </div>
            <button
              formaction="?/withEmail"
              class="styled-button"
              disabled={loading}
            >
              Send Link <Icon class="icon" src={PaperAirplane} />
            </button>
          </div>
        </form>
        <form method="POST" use:enhance={handleSocialLogin}>
          <div class="input-group">
            <button class="styled-button" formaction="?/login&provider=google">
              <Googleicon size={20} />
              Sign in with Google
            </button>
            <button
              class="styled-button"
              data-tooltip="coming soon"
              disabled={true}
              formaction="?/login&provider=github">Sign in with Github</button
            >
            <button
              class="styled-button"
              data-tooltip="coming soon"
              disabled={true}
              formaction="?/login&provider=discord">Sign in with Discord</button
            >
          </div>
        </form>
      </div>
      <article style="line-height: 2;">
        <h1>Important</h1>
        <p>
          Logging in with a provider such as Google is recommended. Logging in
          by Email with the same gmail account would use the same Paratune
          account, so using the Google method will be faster.
        </p>
        <p>
          Logging in with Email may fail under heavy load. This issue will be
          gone when I add <a target="_blank" href="https://sendgrid.com">
            Sendgrid</a
          > to the project soon.
        </p>
        <p>
          You will see Supabase urls when logging, this is the testing backend.
          In live production, this experience will be less confusing.
        </p>
      </article>
    </div>
  {/if}
</div>
