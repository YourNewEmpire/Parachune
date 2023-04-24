<script lang="ts">
  import { onDestroy } from "svelte";
  import { Icon, Play, Pause } from "svelte-hero-icons";
  import { songSelectedUrl } from "$lib/stores";
  import type { SupabaseClient } from "@supabase/supabase-js";

  export let sClient: SupabaseClient;

  let audioBind: HTMLAudioElement;
  let scrubBind: HTMLInputElement;
  let time = 0;
  let paused = false;
  let duration: number;
  let audioData: string;
  let songUrl: string;

  const unsubscribe = songSelectedUrl.subscribe((value) => {
    songUrl = value;
  });
  onDestroy(unsubscribe);

  const downloadSong = async (url: string) => {
    try {
      const { data: songData, error: songError } = await sClient.storage
        .from("songs")
        .download(url);
      if (!songError) {
        audioData = URL.createObjectURL(songData);
      }
    } catch (e) {
      // todo - push error toaster
      console.log(e);
    }
  };
  // click handlers
  function clearSong() {
    songSelectedUrl.set("");
    audioData = "";
  }
  function handlePause() {
    if (paused) {
      audioBind.play();
    } else {
      audioBind.pause();
    }
    paused = !paused;
  }

  // function format(seconds) {
  //   if (isNaN(seconds)) return "...";

  //   const minutes = Math.floor(seconds / 60);
  //   seconds = Math.floor(seconds % 60);
  //   if (seconds < 10) seconds = "0" + seconds;

  //   return `${minutes}:${seconds}`;
  // }
  $: if (songUrl) downloadSong(songUrl);
  $: if (scrubBind)
    scrubBind.style.backgroundSize =
      ((time - 0) * 100) / (duration - 0) + "% 100%";
</script>

{#if audioData}
  <div class="player-wrapper">
    <div class="controls">
      <div>
        <input
          type="range"
          bind:this={scrubBind}
          bind:value={time}
          min="0"
          max={duration}
        />
      </div>
      <div class="buttons">
        {#if paused}
          <button class="styled-button" on:click={handlePause}>
            <Icon style="width: 2rem;" src={Play} />
          </button>
        {:else}
          <button class="styled-button" on:click={handlePause}>
            <Icon style="width: 2rem;" src={Pause} />
          </button>
        {/if}
        <button on:click={clearSong}>X Stop listening</button>
      </div>
    </div>

    <audio autoplay bind:this={audioBind} bind:currentTime={time} bind:duration>
      <source src={audioData} type="audio/mp3" />
      Your browser does not support the audio element.
    </audio>
  </div>
{/if}

<style>
  .player-wrapper {
    display: block;
    position: fixed;
    margin-left: 250px;
    bottom: 0;
    left: 0;
    width: calc(100% - 250px);
    border-radius: 1rem 0px 0px 0px;
    background-color: blueviolet;
  }
  .controls {
    padding: 1rem 1rem;
    display: block;
  }

  .buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
  }
</style>
