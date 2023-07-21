<script lang="ts">
  import { fly } from "svelte/transition";
  import { songsQueued, songPlaying, songsPlayed, addToast } from "$lib/stores";
  import {
    Icon,
    Play,
    Pause,
    Backward,
    Forward,
    XCircle,
  } from "svelte-hero-icons";
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
        paused = false;
      }
    } catch (e) {
      // todo - push error toaster
      console.log(e);
    }
  };
  const reachedTrackEnd = () => {
    $songPlaying = false;
    console.log("reachedTrackEnd");
    $songsPlayed = [...$songsPlayed, $songsQueued[0]];
    $songsQueued = $songsQueued.slice(1);
    if ($songsQueued.length === 0) {
      console.log("nothing remaining in queue");
      endPlayer();
    }
  };

  // click handlers
  function endPlayer() {
    audioBind.pause();
    audioBind.currentTime = 0;
    isOpen = false;
    $songPlaying = false;
    paused = true;
    $songsQueued = [];
    $songsPlayed = [];
  }

  function handlePause() {
    if (audioBind.paused) {
      audioBind.play();
      paused = false;
    } else {
      audioBind.pause();
      paused = true;
    }
  }
  // todo - USING DOLLAR SYMBOL TO READ AND UPDATE STATE
  function handleForward() {
    $songPlaying = false;
    //! This code is ran in 2 places here in this file. should be considered
    $songsPlayed = [...$songsPlayed, $songsQueued[0]];
    $songsQueued = $songsQueued.slice(1);
  }
  // Correct way of handling state
  function handleBack() {
    $songPlaying = false;
    if ($songsPlayed.at(-1)) {
      songsQueued.update((songs) => {
        songs.shift();
        // using OR gate here to stop TS lint.
        songs.unshift($songsPlayed.at(-1) || "");
        return songs;
      });
      songsPlayed.update((songs) => {
        songs.pop();
        return songs;
      });
    } else {
      addToast({
        type: "info",
        dismissable: true,
        message: "No songs behind in queue",
        timeout: 3000,
      });
    }
  }

  function formatTime(seconds: any) {
    if (isNaN(seconds)) return "...";

    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    if (seconds < 10) seconds = "0" + seconds;

    return `${minutes}:${seconds}`;
  }

  $: if ($songPlaying == true)
    scrubBind.style.backgroundSize =
      ((time - 0) * 100) / (duration - 0) + "% 100%";

  $: if (time === duration) reachedTrackEnd();
  $: if ($songsQueued.length > 0) downloadSong($songsQueued[0]);
</script>

{#if isOpen}
  <div
    in:fly={{ y: 200, duration: 1500 }}
    out:fly={{ y: 400, duration: 1500 }}
    class="player-wrapper"
  >
    <div class="controls">
      <div class="scrub">
        <p>{formatTime(time)}</p>
        <input
          type="range"
          bind:this={scrubBind}
          bind:value={time}
          min="0"
          max={duration}
        />
        <p>{formatTime(duration)}</p>
      </div>
      <div class="buttons">
        <button
          class="styled-button"
          data-tooltip="Backward"
          on:click={handleBack}
        >
          <Icon style="width: 2rem;" src={Backward} />
        </button>
        {#if paused}
          <button
            class="styled-button"
            data-tooltip="Play"
            on:click={handlePause}
          >
            <Icon style="width: 2rem;" src={Play} />
          </button>
        {:else}
          <button
            class="styled-button"
            data-tooltip="Pause"
            on:click={handlePause}
          >
            <Icon style="width: 2rem;" src={Pause} />
          </button>
        {/if}
        <button
          class="styled-button"
          data-tooltip="Forward"
          on:click={handleForward}
        >
          <Icon style="width: 2rem;" src={Forward} />
        </button>
        <button
          class="styled-button"
          style="position: absolute; right: 0;"
          on:click={endPlayer}
        >
          <Icon src={XCircle} style="width: 2rem;" />
          Close Player
        </button>
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
    padding: 0 5px;
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
    position: relative;
  }

  .scrub {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    column-gap: 4px;
  }
</style>
