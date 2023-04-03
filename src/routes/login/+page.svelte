<script lang="ts">
  import { Icon, PaperAirplane } from "svelte-hero-icons";
  import type { PageData } from "./$types";
  export let data: PageData;
  let mailInput: string;
  let formStatus: string;
  function handleInput(e: any) {
    mailInput = e.target.value;
  }
  async function signInWithEmail() {
    const { error } = await data.supabase.auth.signInWithOtp({
      email: mailInput,
      options: {
        emailRedirectTo: `${data.url}/logging-in?redirect=/account`,
      },
    });
    if (error) {
      formStatus = "There was an error, try again.";
    } else {
      //push to toast state
      formStatus =
        "Check mail, you can close this tab when the link in your mail works.";
    }
  }
</script>

<svelte:head>
  <title>Login - Connected Music</title>
</svelte:head>

<div>
  {#if data.session}
    <h1>Logged in. Continue here or on new tab.</h1>
  {:else}
    <div style="width: 15rem;" class="card">
      <div class="input-group">
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
      </div>
    </div>
  {/if}
</div>
