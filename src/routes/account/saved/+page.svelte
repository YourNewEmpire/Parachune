<script lang="ts">
  import Playbutton from "$lib/Playbutton.svelte";
  import Songcard from "$lib/songcard.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  let { savedSongs } = data;
</script>

<div>
  <h1>Saved Music</h1>
  <div class="card-container">
    {#if savedSongs}
      {#each savedSongs ?? [] as song}
        <Songcard {song} />
      {/each}
    {:else}
      <p>No songs saved.</p>
    {/if}
  </div>
</div>
