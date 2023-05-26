<script lang="ts">
  import { fly } from "svelte/transition";
  import { songsQueued, songPlaying } from "$lib/stores";
  import { Icon, Play, Pause } from "svelte-hero-icons";
  import type { SupabaseClient } from "@supabase/supabase-js";

  export let sClient: SupabaseClient;
  let audioBind: HTMLAudioElement;
  let scrubBind: HTMLInputElement;
  let time = 0;
  let paused = false;
  let duration: number;
  let isOpen: boolean;

  const downloadSong = async (url: string | undefined) => {
    console.log("start dl");
    console.log($songsQueued);
    if (!url) {
      console.log("no url");
      return;
    }
    if ($songPlaying) {
      console.log("already playing");
      return;
    }

    try {
      isOpen = true;
      const { data: songData, error: songError } = await sClient.storage
        .from("songs")
        .download(url);
      if (!songError) {
        audioBind.src = URL.createObjectURL(songData);
        audioBind.load();
        audioBind.play();
        $songPlaying = true;
      }
    } catch (e) {
      // todo - push error toaster
      console.log(e);
    }
  };
  const reachedEnd = () => {
    $songPlaying = false;
    console.log("reachedEnd");

    // if ($songsQueued.length === 1) {
    //   console.log("nothing remaining in queue");
    //   clearSong();
    // }

    $songsQueued = $songsQueued.slice(1);
    if ($songsQueued.length === 0) {
      console.log("nothing remaining in queue");
      clearSong();
    }
  };

  // click handlers
  function clearSong() {
    isOpen = false;
    $songPlaying = false;
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
  $: if (scrubBind)
    scrubBind.style.backgroundSize =
      ((time - 0) * 100) / (duration - 0) + "% 100%";
  $: if (time === duration) reachedEnd();
  $: if ($songsQueued.length > 0) downloadSong($songsQueued[0]);
  // when user presses queuebutton but nothing selected
  // $: if (!isOpen && $songsQueued.length > 0) queueSong();
</script>

{#if isOpen}
  <div
    in:fly={{ y: 200, duration: 1500 }}
    out:fly={{ y: 400, duration: 1500 }}
    class="player-wrapper"
  >
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
      <source type="audio/mp3" />

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
    background-color: #9898ac;
    box-shadow: 0px 0px 6px #856bdc;
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
