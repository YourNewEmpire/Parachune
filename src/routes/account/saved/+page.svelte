<script lang="ts">
  import Songcard from "$lib/ui/songcard.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  let { savedSongs, profile } = data;
  //todo - handle empty data, current if statement not working as expected
</script>

<div>
  <h1>Saved Music</h1>
  <div class="card-container">
    {#if savedSongs}
      {#each savedSongs as saved}
        {#if saved.song}
          <Songcard
            unSave={true}
            song={{
              ...saved.song,
              profiles: { username: profile?.username || "" },
            }}
          />
        {:else}
          <p>No song. skeleton needed here</p>
        {/if}
      {/each}
    {:else}
      <p>No songs saved.</p>
    {/if}
  </div>
</div>
