<script lang="ts">
  import type { PageData } from "./$types";
  import { addToast } from "$lib/stores";
  import tooltip from "$lib/utils/tooltip";
  import AvatarIcon from "$lib/avataricon.svelte";
  import Stripeicon from "$lib/stripeicon.svelte";
  import Songcard from "$lib/songcard.svelte";
  import Albumimage from "$lib/albumimage.svelte";

  export let data: PageData;
  let { artistProfile, stripeReady } = data;

  async function createDonation() {
    addToast({
      type: "info",
      dismissable: false,
      message: "Waiting for redirect to Stripe donation checkout",
      timeout: 10000,
    });
    const response = await fetch("/api/artistdonation", {
      method: "POST",
      body: JSON.stringify({ stripe_id: artistProfile?.stripe_id }),
      headers: {
        "content-type": "application/json",
      },
    });
    if (!response) {
      addToast({
        type: "failure",
        dismissable: false,
        message: "No response from server",
        timeout: 10000,
      });
    }
    const stripeLink = await response.json();
    if (!stripeLink) {
      addToast({
        type: "failure",
        dismissable: false,
        message: "Server side failed, try again or contact the dev",
        timeout: 10000,
      });
    }
    window.location.href = stripeLink;
  }
</script>

<svelte:head>
  <title>{artistProfile?.username ?? "Unknown user"} - Parachune</title>
</svelte:head>

{#if artistProfile}
  <section>
    <h1>{artistProfile.username}'s profile</h1>
    <div class="card">
      <article class="artist-heading">
        <AvatarIcon
          altText={artistProfile.username ?? ""}
          url={artistProfile.avatar_url ?? ""}
          size={10}
        />
        <h1>{artistProfile.username}</h1>
      </article>
      <article style="display: flex; justify-content: center;">
        {#if stripeReady}
          <button on:click={() => createDonation()} class="styled-button">
            Donate <Stripeicon />
          </button>
        {:else}
          <span use:tooltip={{ content: "User has not setup Stripe yet" }}>
            <button class="styled-button" disabled>
              Donate <Stripeicon />
            </button>
          </span>
        {/if}
      </article>
    </div>
  </section>
  <section>
    <h1>Music:</h1>
    <div class="card-container">
      {#each artistProfile.songs ?? [] as song}
        <Songcard {song} />
      {/each}
    </div>
    {#if !artistProfile.songs}
      <p>{artistProfile.username} has no songs</p>
    {/if}
  </section>
  <section>
    <h1>Albums:</h1>
    <div class="card-container">
      {#each artistProfile.albums ?? [] as album}
        <a href="/albums/{album.id}" class="link-card col-container">
          <Albumimage altText={album.title} size={10} url={album.image_url} />
          <h1>{album.title}</h1>
        </a>
      {/each}
    </div>
  </section>
{:else}
  <section>
    <h1>Artist has no username yet.</h1>
  </section>
{/if}

<style>
  .artist-heading {
    display: flex;
    flex-direction: column;
    row-gap: 1rem;
    align-items: center;
    justify-content: center;
    & h1 {
      font-size: 1.5rem;
    }
  }
</style>
