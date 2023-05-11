<script lang="ts">
  import type { PageData } from "./$types";
  import Playbutton from "$lib/Playbutton.svelte";
  import Savebutton from "$lib/Savebutton.svelte";
  import Queuebutton from "$lib/Queuebutton.svelte";
  export let data: PageData;
  let { dbData } = data;
</script>

<div>
  <h1>Discover</h1>
  <div class="card-col-container">
    {#each dbData as song}
      <div class="card">
        <div class="row-container">
          <div class="row-container">
            <Playbutton songUrl={song.song_url ?? ""} />
            <Queuebutton songUrl={song.song_url ?? ""} />
            <Savebutton songUrl={song.song_url ?? ""} songId={song.id ?? ""} />
          </div>
          <p>{song.name} | {song.artist}</p>
        </div>
      </div>
    {/each}
  </div>
</div>
