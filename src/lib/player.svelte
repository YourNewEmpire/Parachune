<script lang="ts">
  import { onDestroy } from "svelte";
  import { songSelectedUrl } from "$lib/stores";
  function clearSong() {
    songSelectedUrl.set("");
  }
  let songUrl: string;
  const unsubscribe = songSelectedUrl.subscribe((value) => {
    songUrl = value;
  });
  onDestroy(unsubscribe);
</script>

{#if songUrl}
  <div class="player-wrapper">
    <h1>cunts</h1>
    <button on:click={clearSong}>X Stop listening</button>
  </div>
{/if}

<style>
  .player-wrapper {
    display: block;
    position: fixed;
    margin-left: 250px;
    bottom: 0;
    left: 0;
    width: 100%;
    border-radius: 1rem 100px 10px 0px;
    background-color: blueviolet;
  }
</style>
