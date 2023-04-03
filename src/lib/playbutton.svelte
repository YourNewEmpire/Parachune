<script lang="ts">
  import { Icon, PlayCircle } from "svelte-hero-icons";
  import { songsQueued, songSelectedUrl } from "$lib/stores";
  export let songUrl: string;
  const playSong = (newUrl: string) => {
    songSelectedUrl.set(newUrl);
  };
  const addToQueue = (newUrl: string) => {
    $songsQueued = [...$songsQueued, newUrl];
  };
</script>

<div>
  <button class="styled-button" on:click={() => playSong(songUrl)}
    ><Icon style="width: 2rem;" src={PlayCircle} /></button
  >
</div>

<style></style>
