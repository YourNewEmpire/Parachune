<script lang="ts">
  import type { ActionData, PageData } from "./$types";
  import { enhance } from "$app/forms";
  import type { SubmitFunction } from "@sveltejs/kit";
  import { addToast } from "$lib/stores";
  import Avatar from "./avatar.svelte";
  import Createstripe from "$lib/ui/createstripe.svelte";
  import Stripeicon from "$lib/stripeicon.svelte";
  import TwitterX from "svelte-bootstrap-icons/lib/TwitterX.svelte";
  import Tiktok from "svelte-bootstrap-icons/lib/Tiktok.svelte";
  import Spotify from "svelte-bootstrap-icons/lib/Spotify.svelte";
  import type { Json } from "../../types/DbDefinitions";

  export let data: PageData;
  export let form: ActionData;

  let { session, supabase, profile, stripeReady } = data;
  $: ({ session, supabase, profile, stripeReady } = data);
  //? form element binding to pass profileForm.requestSubmit to Avatar.svelte
  let profileForm: HTMLFormElement;
  let loading = false;
  let fullName: string | null | undefined = profile?.full_name;
  let username: string | null | undefined = profile?.username;
  let website: string | null | undefined = profile?.website;
  let avatarUrl: string = form?.avatarUrl ?? profile?.avatar_url ?? "";
  let socialMediaData: Json | undefined = profile?.social_media_urls;
  let urls = socialMediaData as { [key: string]: string };

  let newPlatform = "";
  let newUrl = "";

  function addSocialMediaUrl() {
    if (newPlatform && newUrl) {
      urls[newPlatform] = newUrl;
      newPlatform = "";
      newUrl = "";
    } else {
      addToast({
        dismissable: true,
        timeout: 3000,
        type: "failure",
        message: "please fill the platform name and url fields",
      });
    }
    console.log(urls);
  }

  const handleSubmit: SubmitFunction = ({ formData, cancel }) => {
    loading = true;
    let uName = String(formData.get("username"));
    if (uName?.length < 1) {
      addToast({
        type: "failure",
        message: "Cancelled request, username not long enough",
        timeout: 5000,
        dismissable: true,
      });
      cancel();
      loading = false;
    }
    return async ({ result }) => {
      loading = false;
      if (result.type === "failure") {
        if (result.data?.isUsernameTaken) {
          addToast({
            type: result.type,
            message:
              "Failed! Username taken, try another or contact support about names",
            timeout: 5000,
            dismissable: true,
          });
          return;
        } else if (result.data?.isUsernameShort) {
          addToast({
            type: result.type,
            message:
              "Failed! Username too short, at least 1 character required.",
            timeout: 5000,
            dismissable: true,
          });
          return;
        } else if (result.data?.isAuth === false) {
          addToast({
            type: result.type,
            message:
              "Failed! No user session found, please refresh and login again.",
            timeout: 5000,
            dismissable: true,
          });
          return;
        } else
          addToast({
            type: result.type,
            message: "Failed to update account, try again",
            timeout: 5000,
            dismissable: true,
          });
        return;
      } else {
        addToast({
          type: "success",
          message: "Profile change successful!",
          timeout: 5000,
          dismissable: true,
        });
        return;
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
    <section class="card col-span-full" style="position: relative;">
      <a
        href="/profiles/{session.user.id}"
        class="styled-link"
        style="position: absolute; right: 0; margin-right: 1rem;"
        >View Profile
      </a>
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
              name="websiteUrl"
              type="text"
              value={form?.website ?? website ?? ""}
            />
          </div>
          <p>Add your social platforms. Be sure to press update</p>
          <div class="input-item">
            <label for="">Platform name</label>
            <input
              type="text"
              placeholder="Platform"
              bind:value={newPlatform}
            />
            <label for="">Platform url</label>

            <input type="text" placeholder="URL" bind:value={newUrl} />
            <button
              class="styled-button"
              on:click|preventDefault={addSocialMediaUrl}>Add</button
            >
          </div>
          {#if Object.keys(urls).length > 0}
            {#each Object.entries(urls) as [key, value]}
              <div class="input-item">
                <label for={`social_${key}`}>{key}</label>
                <input
                  type="text"
                  id={`social_${key}`}
                  name={`social_${key}`}
                  {value}
                />
              </div>
            {/each}
          {:else}
            <p>No social links added</p>
          {/if}
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
