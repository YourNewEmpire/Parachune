<script lang="ts">
  import AvatarIcon from "$lib/AvatarIcon.svelte";
  import Playbutton from "$lib/Playbutton.svelte";
  import Queuebutton from "$lib/Queuebutton.svelte";
  import { addToast } from "$lib/stores";
  import type { PageData } from "./$types";

  export let data: PageData;
  let { artistProfile, artistSongs } = data;
</script>

<div>
  <h1>{artistProfile.username}'s artistProfile</h1>
  <div class="card">
    <div class="artistProfile-heading">
      <AvatarIcon url={artistProfile.avatar_url} size={15} />
      <h1>{artistProfile.username}</h1>
    </div>
    <div class="row-container">
      <div />
    </div>
  </div>
  <h1>Music:</h1>
  <div class="row-container">
    {#each artistSongs ?? [] as song}
      <div class="card">
        <p>{song.name}</p>
        <div class="row-container" style="justify-content: center;">
          <Playbutton songUrl={song.song_url} />
          <Queuebutton songUrl={song.song_url} />
        </div>
      </div>
    {/each}
  </div>
  {#if !artistSongs}
    <p>{artistProfile.username} has no artistSongs</p>
  {/if}

  <h1>Albums coming soon</h1>
</div>

<style>
  .artistProfile-heading {
    display: flex;
    flex-direction: column;
    row-gap: 1rem;
    align-items: center;
    justify-content: center;
  }
</style>
