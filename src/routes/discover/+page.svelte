<script lang="ts">
  import type { PageData } from "./$types";
  import { songsQueued, songSelectedUrl } from "$lib/stores";
  import Playbutton from "$lib/Playbutton.svelte";
  import Savebutton from "$lib/Savebutton.svelte";
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
      <div class="row-container">
        <div class="row-container">
          <Playbutton songUrl={song.song_url ?? ""} />
          <Savebutton songUrl={song.song_url ?? ""} songId={song.id ?? ""} />
        </div>
        <p>{song.name}</p>
      </div>
    </div>
  {/each}
  {#each $songsQueued as item}
    <div>
      {item}
    </div>
  {/each}
</div>
