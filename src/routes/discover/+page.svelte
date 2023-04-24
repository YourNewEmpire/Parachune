<script lang="ts">
  import type { PageData } from "./$types";
  import { songsQueued } from "$lib/stores";
  import Playbutton from "$lib/playbutton.svelte";
  import Savebutton from "$lib/savebutton.svelte";
  export let data: PageData;
  let { dbData } = data;
</script>

<div>
  <h1>find music</h1>
  <div class="card-col-container">
    {#each dbData as song}
      <div class="card">
        <div class="row-container">
          <div class="row-container">
            <Playbutton songUrl={song.song_url ?? ""} />
            <Savebutton songUrl={song.song_url ?? ""} songId={song.id ?? ""} />
          </div>
          <p>{song.name} | {song.artist}</p>
        </div>
      </div>
    {/each}
  </div>
</div>
