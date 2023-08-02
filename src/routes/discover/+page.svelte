<script lang="ts">
  import type { PageData } from "./$types";
  import SongCard from "$lib/songcard.svelte";
  export let data: PageData;
  let { dbData } = data;
</script>

<svelte:head>
  <title>Discover Music - Parachune</title>
</svelte:head>

<div>
  <h1>Discover</h1>
  <div class="card-col-container">
    {#each dbData as song}
      <SongCard {song} />
    {/each}
    <a
      class="styled-button"
      style="max-width: 25%; align-self: center;"
      href="/songs"
      >Find all songs
    </a>
  </div>
</div>
