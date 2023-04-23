<!-- src/routes/account/+page.svelte -->
<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionResult } from "@sveltejs/kit";
  import type { ActionData, PageData } from "./$types";
  import { addToast } from "$lib/stores";

  export let data: PageData;
  export let form: ActionData;

  let { session, profile } = data;

  let profileForm: any;
  let loading = false;
  let fullName: string | null = profile?.full_name;
  let username: string | null = profile?.username;
  let website: string | null = profile?.website;
  // let avatarUrl: string | null = profile?.avatar_url;

  function handleSubmit() {
    loading = true;
    return async ({ result }: { result: ActionResult }) => {
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
      console.log(result);
    };
  }
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

        <div class="row-container">
          <input
            style="font-family: Sono, sans-serif;"
            type="submit"
            class="styled-button"
            value={loading ? "Loading..." : "Update"}
            disabled={loading}
          />
          <button
            formaction="?/signout&redirectTo=/"
            style="margin-left: auto; font-family: Sono, sans-serif;"
            class="styled-button"
            type="submit"
            disabled={loading}
          >
            Sign Out
          </button>
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
