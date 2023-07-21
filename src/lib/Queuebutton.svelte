<script lang="ts">
  import { Icon, Bars3CenterLeft } from "svelte-hero-icons";
  import { songsQueued } from "$lib/stores";

  export let songUrl: string;

  const addToQueue = (newUrl: string) => {
    $songsQueued = [...$songsQueued, newUrl];
  };
</script>

<div>
  <button
    class="styled-button"
    data-tooltip="Add To Queue"
    on:click={() => addToQueue(songUrl)}
  >
    <Icon style="width: 2rem;" src={Bars3CenterLeft} />
  </button>
</div>
