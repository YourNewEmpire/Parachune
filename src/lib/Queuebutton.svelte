<script lang="ts">
  import { Icon, Bars3CenterLeft } from "svelte-hero-icons";
  import { songsQueued } from "$lib/stores";

  export let songUrl: string;
  const addToQueue = (newUrl: string) => {
    $songsQueued = [...$songsQueued, newUrl];
  };
</script>

<div>
  <button class="styled-button" on:click={() => addToQueue(songUrl)}>
    <Icon style="width: 2rem;" src={Bars3CenterLeft} />
  </button>
</div>
