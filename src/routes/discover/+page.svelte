<script lang="ts">
  import type { PageData } from "./$types";
  import SongCard from "$lib/songcard.svelte";
  export let data: PageData;
  let { songData, profileFetch } = data;
</script>

<svelte:head>
  <title>Discover Music - Parachune</title>
</svelte:head>

<div>
  <h1>Discover</h1>
  <section class="card-container">
    {#each songData as song}
      <SongCard {song} />
    {/each}
  </section>
  <section style="justify-content: center; display: flex; margin-top: 1rem;">
    <a class="styled-button" style="width:fit-content" href="/songs"
      >Find all songs
    </a>
  </section>
</div>
