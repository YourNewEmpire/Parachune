<script lang="ts">
  import Songcard from "$lib/songcard.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  let { savedSongs } = data;
</script>

<div>
  <h1>Saved Music</h1>
  <div class="card-container">
    {#if savedSongs}
      {#each savedSongs as saved}
        {#if saved.song}
          <Songcard unSave={true} song={saved.song} />
        {:else}
          <p>No song. skeleton needed here</p>
        {/if}
      {/each}
    {:else}
      <p>No songs saved.</p>
    {/if}
  </div>
</div>
