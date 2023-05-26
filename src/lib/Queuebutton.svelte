<script lang="ts">
  import { Icon, Bars3CenterLeft } from "svelte-hero-icons";
  import { songsQueued } from "$lib/stores";

  export let songUrl: string;
  const addToQueue = (newUrl: string) => {
    $songsQueued = [...$songsQueued, newUrl];
  };
</script>

<div>
  <button class="styled-button tooltip" on:click={() => addToQueue(songUrl)}>
    <Icon style="width: 2rem;" src={Bars3CenterLeft} />
    <span class="tooltiptext">
      {$songsQueued.length > 0
        ? `Place after ${$songsQueued[0]} in queue`
        : "Play now, as there's nothing in queue"}
    </span>
  </button>
</div>

<style></style>
