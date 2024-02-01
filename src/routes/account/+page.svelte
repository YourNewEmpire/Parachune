<script lang="ts">
  import type { ActionData, PageData } from "./$types";
  import { enhance } from "$app/forms";
  import type { SubmitFunction } from "@sveltejs/kit";
  import { addToast } from "$lib/stores";
  import Avatar from "./avatar.svelte";
  import Createstripe from "$lib/createstripe.svelte";
  import Stripeicon from "$lib/stripeicon.svelte";

  export let data: PageData;
  export let form: ActionData;

  let { session, supabase, profile, stripeReady } = data;
  $: ({ session, supabase, profile, stripeReady } = data);
  let profileForm: any;
  let loading = false;
  let fullName: string | null = profile?.full_name;
  let username: string | null = profile?.username ?? "no username yet";
  let website: string | null = profile?.website;
  let avatarUrl: string = form?.avatarUrl ?? profile?.avatar_url;

  const handleSubmit: SubmitFunction = () => {
    loading = true;
    return async ({ result }) => {
      loading = false;
      if (result.type === "failure") {
        addToast({
          type: result.type,
          message: "Failed to update account, try again",
          timeout: 5000,
          dismissable: true,
        });
      } else {
        addToast({
          type: "success",
          message: "Profile change successful!",
          timeout: 5000,
          dismissable: true,
        });
      }
    };
  };

  const handleSignOut: SubmitFunction = () => {
    loading = true;
    return async ({ update }) => {
      loading = false;
      update();
      addToast({
        type: "info",
        message: "Successfully logged out",
        timeout: 5000,
        dismissable: true,
      });
    };
  };
</script>

<svelte:head>
  <title>Your Account - Parachune</title>
</svelte:head>
<section>
  <h1>Manage Your Account</h1>
  <section class="account-container">
    <section class="card col-span-full">
      <form
        class="account-form"
        method="post"
        action="?/update"
        use:enhance={handleSubmit}
        bind:this={profileForm}
      >
        <div class="input-group" style="row-gap: 1rem;">
          <div class="input-item">
            <label for="email">Email</label>
            <input
              id="email"
              type="text"
              value={session?.user.email}
              disabled
            />
          </div>

          <div class="input-item">
            <label for="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={form?.fullName ?? fullName ?? ""}
            />
          </div>

          <div class="input-item">
            <label for="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={form?.username ?? username ?? ""}
            />
          </div>

          <div class="input-item">
            <label for="website">Website</label>
            <input
              id="website"
              name="website"
              type="website"
              value={form?.website ?? website ?? ""}
            />
          </div>
        </div>
        <Avatar
          {supabase}
          bind:url={avatarUrl}
          size={10}
          on:upload={() => {
            profileForm.requestSubmit();
          }}
        />
        <div class="row-container">
          <button type="submit" class="styled-button" disabled={loading}>
            Update
          </button>

          <form method="post" action="?/signout" use:enhance={handleSignOut}>
            <div>
              <button class="styled-button" disabled={loading}>Sign Out</button>
            </div>
          </form>
        </div>
      </form>
    </section>
    <section class="card col-span-full">
      {#if stripeReady}
        <article
          style="display: flex; flex-direction: row; align-items: center;"
        >
          <Stripeicon />
          <p>is ready</p>
        </article>
      {:else}
        <article
          style="display: flex; flex-direction: column; align-items: center;"
        >
          <Stripeicon />
          <p>
            You have not linked your account with our Stripe integration and
            submitted your details. Please click below to begin receiving secure
            donations from other users with Stripe.
          </p>
        </article>

        <Createstripe />
      {/if}
    </section>
    <section class="card">
      <h1>your music</h1>
      <div class="row-container">
        <a class="styled-button" style="width: 50%" href="/account/upload">
          🪂 Upload</a
        >
        <a class="styled-button" style="width: 50%" href="/account/music">
          💿 View your songs</a
        >
      </div>
    </section>
    <section class="card">
      <h1>Songs you like</h1>
      <a class="styled-button" style="width: 50%" href="/account/saved">
        ⭐ View your saved songs</a
      >
    </section>
  </section>
</section>

<style>
  .account-container {
    display: grid;
    grid-template-columns: 50% 50%;
    width: 100%;
    gap: 0.5rem;
  }

  .col-span-full {
    grid-column-start: 1;
    grid-column-end: 3;
  }

  .account-form {
    display: grid;
    gap: 25px;
    grid-template-columns: 1fr;
  }
  .account-form input {
    border-radius: 0.5rem;
    border: none;
    padding: 0.5em;
    font-size: 1em;
    font-family: "League Spartan";
  }
  @media only screen and (min-width: 768px) {
    .account-form {
      display: grid;
      grid-template-columns: 1fr 2fr;
    }
  }
</style>
