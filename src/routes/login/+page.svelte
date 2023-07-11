<script lang="ts">
  import type { SubmitFunction } from "@sveltejs/kit";
  import type { PageData } from "./$types";
  import { enhance } from "$app/forms";
  import { addToast } from "$lib/stores";

  export let data: PageData;
  export let form;
  let loading = false;
  /*
<input
placeholder="email"
on:input={handleInput}
type="text"
name="email"
/>
<button class="styled-button" on:click={signInWithEmail}
>Send Magic Link <Icon class="icon" src={PaperAirplane} /></button
>
{formStatus ?? ""}
*/
  const handleSignIn: SubmitFunction = () => {
    loading = true;
    return async ({ update, result }) => {
      loading = false;
      if (result.type === "success") {
        addToast({
          type: result.type,
          message:
            "Please check your email for a magic link to log into the website.",
          timeout: 3000,
          dismissable: true,
        });
      } else {
        addToast({
          type: "failure",
          message: "Log in failed. Try again",
          timeout: 3000,
          dismissable: true,
        });
      }
      update();
    };
  };
</script>

<svelte:head>
  <title>Login - Parachune</title>
</svelte:head>

<div>
  {#if data.session}
    <h1>Logged in. Continue here or on new tab.</h1>
  {:else}
    <div style="width: 15rem;" class="card">
      <form method="post" use:enhance={handleSignIn}>
        <div class="input-group">
          <input name="email" placeholder="Email" value={form?.email ?? ""} />

          <button class="styled-button">Sign up</button>
        </div>
      </form>
    </div>
  {/if}
</div>
