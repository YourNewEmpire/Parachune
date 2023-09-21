<script lang="ts">
  import type { ActionData, PageData } from "./$types";
  import { enhance } from "$app/forms";
  import type { SubmitFunction } from "@sveltejs/kit";
  import { addToast } from "$lib/stores";
  import Avatar from "./Avatar.svelte";
  import { Icon, QuestionMarkCircle } from "svelte-hero-icons";

  export let data: PageData;
  export let form: ActionData;

  let { session, supabase, profile } = data;
  $: ({ session, supabase, profile } = data);
  let profileForm: any;
  let loading = false;
  let fullName: string | null = profile?.full_name;
  let username: string | null = profile?.username ?? "no username yet";
  let website: string | null = profile?.website;
  let paypalId: string | null = profile?.paypal_id;
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
          type: result.type,
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

<div>
  <h1>Your Account</h1>
  <div class="account-container">
    <section class="card">
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
            <label
              style="display: flex; align-items: center; column-gap: 6px;"
              for="paypal-merchantid"
              >Paypal Merchant ID (donations which are coming soon)
              <div
                data-tooltip="You can find your merchant id on your paypal profile page"
              >
                <Icon src={QuestionMarkCircle} style="width: 1.5rem;" />
              </div>
            </label>
            <input
              id="paypalId"
              name="paypalId"
              type="text"
              value={form?.paypalId ?? paypalId ?? ""}
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

      {#if form?.success}
        <div>Profile Updated</div>
      {/if}
    </section>

    <section class="card">
      <h1>your music</h1>
      <a href="/account/upload">Upload more</a>
    </section>
    <section class="card">
      <h1>Songs you like</h1>
      <a href="/account/saved">See all</a>
    </section>
  </div>
</div>

<style>
  .account-container {
    display: grid;
    grid-template-columns: 100%;
    width: 100%;
    row-gap: 6px;
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
      grid-template-columns: 2fr 1fr;
    }
  }
  @media only screen and (min-width: 1024px) {
    .account-container {
      display: grid;
      grid-template-columns: 60% 20% 20%;
      width: 100%;
      column-gap: 6px;
    }
  }
</style>
