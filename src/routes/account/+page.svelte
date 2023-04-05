<!-- src/routes/account/+page.svelte -->
<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData, PageData } from "./$types";

  export let data: PageData;
  export let form: ActionData;

  let { session, profile } = data;

  let profileForm: any;
  let loading = false;
  let fullName: string | null = profile?.full_name;
  let username: string | null = profile?.username;
  let website: string | null = profile?.website;
  let avatarUrl: string | null = profile?.avatar_url;

  function handleSubmit() {
    loading = true;
    return async () => {
      loading = false;
    };
  }
</script>

<div class="account-container">
  <div class="card">
    <div>
      <form
        class="input-group"
        method="post"
        action="?/update"
        use:enhance={handleSubmit}
        bind:this={profileForm}
      >
        <div>
          <label for="email">Email</label>
          <input id="email" type="text" value={session?.user.email} disabled />
        </div>

        <div>
          <label for="fullName">Full Name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={form?.fullName ?? fullName ?? ""}
          />
        </div>

        <div>
          <label for="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            value={form?.username ?? username ?? ""}
          />
        </div>

        <div>
          <label for="website">Website</label>
          <input
            id="website"
            name="website"
            type="website"
            value={form?.website ?? website ?? ""}
          />
        </div>

        <div>
          <input
            type="submit"
            class="styled-button"
            value={loading ? "Loading..." : "Update"}
            disabled={loading}
          />
        </div>
      </form>
      {#if form?.success}
        <div>Profile Updated</div>
      {/if}
      <form method="post" action="?/signout&redirectTo=/">
        <button
          style="margin-left: auto;"
          class="styled-button"
          type="submit"
          disabled={loading}>Sign Out</button
        >
      </form>
    </div>
  </div>

  <div class="card">
    <h1>your music</h1>
    <a href="/account/upload"> Upload more</a>
  </div>
</div>

<style>
  .account-container {
    display: flex;
    flex-direction: row;
    column-gap: 2rem;
  }
</style>
