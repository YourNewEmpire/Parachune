<script lang="ts">
  import type { PageData } from "./$types";
  import Playbutton from "$lib/Playbutton.svelte";
  import Savebutton from "$lib/Savebutton.svelte";
  import Queuebutton from "$lib/Queuebutton.svelte";
  import AvatarIcon from "$lib/AvatarIcon.svelte";
  export let data: PageData;
  let { dbData, supabase } = data;
</script>

<svelte:head>
  <title>Discover Music - Parachune</title>
</svelte:head>

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
          <div class="song-info">
            <p>
              {song.name}
            </p>
            <div class="row-container">
              <AvatarIcon size={5} {supabase} url={song.profiles.avatar_url} />
              <p>
                {song.artist}
              </p>
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .song-info {
    display: flex;
    flex-direction: column;
    row-gap: 6px;
  }
</style>
