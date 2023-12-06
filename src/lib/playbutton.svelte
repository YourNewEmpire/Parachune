<script lang="ts">
  import { Icon, PlayCircle } from "svelte-hero-icons";
  import { songPlaying, songsQueued } from "$lib/stores";
  import tooltip from "./utils/tooltip";

  export let songUrl: string;

  const playSong = (newUrl: string) => {
    $songPlaying = false;
    $songsQueued = [newUrl, ...$songsQueued.slice(1)];
  };
</script>

<div>
  <button
    class="styled-button"
    use:tooltip={{ content: "Play Now" }}
    on:click={() => playSong(songUrl)}
  >
    <Icon style="width: 2rem;" src={PlayCircle} />
  </button>
</div>
