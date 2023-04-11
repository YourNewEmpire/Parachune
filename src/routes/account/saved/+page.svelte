<script lang="ts">
  import Playbutton from "$lib/playbutton.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  let { session, likedSongs } = data;
</script>

<div>
  <h1>Saved Music</h1>

  {#if likedSongs}
    {#each likedSongs as song}
      <div class="card">
        <div class="row-container">
          <div class="row-container">
            <Playbutton songUrl={song.song_url ?? ""} />
          </div>
          <p>{song.name}</p>
        </div>
      </div>
    {/each}
  {/if}
</div>
