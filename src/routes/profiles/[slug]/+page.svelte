<script lang="ts">
  import AvatarIcon from "$lib/AvatarIcon.svelte";
  import Playbutton from "$lib/Playbutton.svelte";
  import Queuebutton from "$lib/Queuebutton.svelte";
  import Savebutton from "$lib/Savebutton.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
  let { artistProfile, artistSongs } = data;
</script>

<svelte:head>
  <title>{artistProfile.username} - Parachune</title>
</svelte:head>
<h1>{artistProfile.username}'s profile</h1>
<section class="card">
  <article class="artist-heading">
    <AvatarIcon
      altText={artistProfile.username}
      url={artistProfile.avatar_url}
      size={15}
    />
    <h1>{artistProfile.username}</h1>
  </article>
</section>
<h1>Music:</h1>
<div class="card-container">
  {#each artistSongs ?? [] as song}
    <div class="artist-song-container">
      <a
        style="width: fit-content;"
        class="text-ellipsis styled-link"
        href="/songs/{song.id}">{song.name}</a
      >
      <div class="song-buttons">
        <Playbutton songUrl={song.song_url} />
        <Queuebutton songUrl={song.song_url} />
        <Savebutton songUrl={song.song_url} songId={song.id} />
      </div>
    </div>
  {/each}
</div>
{#if !artistSongs}
  <p>{artistProfile.username} has no artistSongs</p>
{/if}

<h1>Albums coming soon</h1>

<style>
  .artist-heading {
    display: flex;
    flex-direction: column;
    row-gap: 1rem;
    align-items: center;
    justify-content: center;
  }
  .artist-song-container {
    background-color: #9898ac;
    box-shadow: 0px 0px 8px #856bdc;
    border-radius: 0.5rem;
    padding: 1rem 1rem;
    color: #1a1a26;
    display: flex;
    flex-direction: column;
    row-gap: 1rem;
    align-items: center;
    & .song-buttons {
      display: flex;
      flex-direction: row;
      column-gap: 0.25rem;
    }
  }
</style>
