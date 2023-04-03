<script lang="ts">
  import type { PageData } from "./$types";
  import { songsQueued, songSelectedUrl } from "$lib/stores";
  export let data: PageData;
  let { dbData } = data;
  const playSong = (newUrl: string) => {
    songSelectedUrl.set(newUrl);
  };
  const addToQueue = (newUrl: string) => {
    $songsQueued = [...$songsQueued, newUrl];
  };
</script>

<div>
  <h1>find music</h1>
  {#each dbData as song}
    <div class="card">
      {song.name}
      <button on:click={() => playSong(song.song_url)}>Play Song</button>
    </div>
  {/each}
  {#each $songsQueued as item}
    <div>
      {item}
    </div>
  {/each}
</div>
