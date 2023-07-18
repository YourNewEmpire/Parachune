<script lang="ts">
  import { Icon, PlayCircle } from "svelte-hero-icons";
  import { songPlaying, songsQueued } from "$lib/stores";

  export let songUrl: string;

  const playSong = (newUrl: string) => {
    $songPlaying = false;
    $songsQueued = [newUrl, ...$songsQueued.slice(1)];
  };
</script>

<div>
  <button class="styled-button" on:click={() => playSong(songUrl)}>
    <Icon style="width: 2rem;" src={PlayCircle} />

    <p>Play</p>
  </button>
</div>
