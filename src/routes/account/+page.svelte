<script lang="ts">
  import type { ActionData, PageData } from "./$types";
  import { enhance } from "$app/forms";
  import type { SubmitFunction } from "@sveltejs/kit";
  import { addToast } from "$lib/stores";
  import Avatar from "./Avatar.svelte";

  export let data: PageData;
  export let form: ActionData;

  let { session, supabase, profile } = data;
  $: ({ session, supabase, profile } = data);
  let profileForm: any;
  let loading = false;
  let fullName: string | null = profile?.full_name;
  let username: string | null = profile?.username;
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
          timeout: 3000,
          dismissable: true,
        });
      } else {
        addToast({
          type: result.type,
          message: "Profile change successful!",
          timeout: 3000,
          dismissable: true,
        });
      }
    };
  };

  // Needs to be used
  const handleSignOut: SubmitFunction = () => {
    loading = true;
    return async ({ update }) => {
      loading = false;
      update();
      addToast({
        type: "info",
        message: "Successfully logged out",
        timeout: 3000,
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
        class="input-group"
        method="post"
        action="?/update"
        use:enhance={handleSubmit}
        bind:this={profileForm}
      >
        <div class="input-item">
          <label for="email">Email</label>
          <input id="email" type="text" value={session?.user.email} disabled />
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
        <Avatar
          {supabase}
          bind:url={avatarUrl}
          size={10}
          on:upload={() => {
            profileForm.requestSubmit();
          }}
        />
        <div class="row-container">
          <button
            style="font-family: Sono, sans-serif;"
            type="submit"
            class="styled-button"
            disabled={loading}
          >
            Update
          </button>

          <form method="post" action="?/signout" use:enhance={handleSignOut}>
            <div>
              <button
                class="styled-button"
                style="font-family: Sono, sans-serif;"
                disabled={loading}>Sign Out</button
              >
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
  @media only screen and (min-width: 1024px) {
    .account-container {
      display: grid;
      grid-template-columns: 60% 20% 20%;
      width: 100%;
      column-gap: 6px;
    }
  }
</style>
