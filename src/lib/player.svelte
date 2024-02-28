<script lang="ts">
  import { fly } from "svelte/transition";
  import type { SupabaseClient } from "@supabase/supabase-js";
  import { songsQueued, songPlaying, songsPlayed, addToast } from "$lib/stores";
  import tooltip from "./utils/tooltip";
  import Playerdisc from "./playerdisc.svelte";
  import VolumeUp from "svelte-bootstrap-icons/lib/VolumeUp.svelte";
  import VolumeMute from "svelte-bootstrap-icons/lib/VolumeMute.svelte";
  import XCircle from "svelte-bootstrap-icons/lib/XCircle.svelte";
  import EyeSlash from "svelte-bootstrap-icons/lib/EyeSlash.svelte";
  import SkipBackward from "svelte-bootstrap-icons/lib/SkipBackward.svelte";
  import SkipForward from "svelte-bootstrap-icons/lib/SkipForward.svelte";
  import Pause from "svelte-bootstrap-icons/lib/Pause.svelte";
  import Play from "svelte-bootstrap-icons/lib/Play.svelte";

  export let sClient: SupabaseClient;
  let audioBind: HTMLAudioElement;
  let scrubBind: HTMLInputElement;
  let volumeScrubBind: HTMLInputElement;
  let time = 0;
  let volume = 0.2;
  let paused: boolean;
  let duration: number;
  // Not sure if this is needed after songPlaying was added
  let isOpen: boolean;

  //object url cache for previous songs
  type objUrlType = {
    songUrl: string;
    objUrl: string;
  };
  let objUrlArr = new Array<objUrlType>(5);
  objUrlArr.splice(0, 5);

  /*
    Download function runs when songsQueued state is changed, 
    either by playbutton.svelte, queuebutton.svelte or handleForward and handleBack functions in this comp.
    Playbutton sets $songPlaying to false, so the function passes on line 47 and loads new audio
  */
  const downloadSong = async (url: string | undefined) => {
    if (!url) {
      // console.log("no url");
      return;
    }

    if ($songPlaying) {
      // console.log("already playing");
      return;
    }
    // If the audio element is binded then the player is being used so...
    // Want to reset time & src before loading next song, so that the scrubBind thumb is moved back.
    if (audioBind) {
      audioBind.currentTime = 0;
      audioBind.src = "";
    }
    //? Check objUrlArr variable for the url passed to this function.
    const foundObjUrl = objUrlArr.find((el) => el.songUrl === url);
    if (foundObjUrl?.songUrl) {
      audioBind.src = foundObjUrl.objUrl;
      audioBind.load();
      //TODO - need to track paused to not autoplay tracks when user is going forward or back
      audioBind.play();
      $songPlaying = true;
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
        //TODO - need to track paused to not autoplay tracks when user is going forward or back
        audioBind.play();
        $songPlaying = true;
        if (objUrlArr.length === 5) {
          let removed = objUrlArr.shift();
          if (removed) {
            URL.revokeObjectURL(removed?.objUrl);
          }
          objUrlArr.push({ objUrl: audioBind.src, songUrl: url });
        } else {
          objUrlArr.push({ objUrl: audioBind.src, songUrl: url });
        }
      }
    } catch (e) {
      isOpen = false;
      $songPlaying = false;
      console.log(e);
      addToast({
        type: "warning",
        dismissable: true,
        message: "There was a problem downloading and playing the next song",
        timeout: 5000,
      });
    }
  };

  // click handlers
  function endPlayer() {
    isOpen = false;
    audioBind.currentTime = 0;
    audioBind.src = "";
    $songPlaying = false;
    $songsQueued = [];
    $songsPlayed = [];
    //? loop through and revoke objUrl
    objUrlArr.forEach((obj, i) => {
      if (obj.objUrl) {
        URL.revokeObjectURL(obj.objUrl);
      }
    });
    objUrlArr.splice(0, 5);
  }

  function trackEnded() {
    if ($songsQueued.length === 0) {
      // console.log("nothing remaining in queue");

      endPlayer();
    } else {
      handleForward();
    }
  }

  function handleForward() {
    if ($songsQueued.length <= 1) {
      // console.log("nothing remaining in queue");
      return;
    }
    // console.log("forward Succeeded");

    $songPlaying = false;

    $songsPlayed = [...$songsPlayed, $songsQueued[0]];
    $songsQueued = $songsQueued.slice(1);
  }

  function handleBack() {
    if ($songsPlayed.at(-1)) {
      $songPlaying = false;
      //@ts-ignore
      $songsQueued = [$songsPlayed.at(-1), ...$songsQueued];

      // Remove the song that was added to songsQueued
      songsPlayed.update((songs) => {
        songs.pop();
        return songs;
      });
    } else {
      return addToast({
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

  $: if (volumeScrubBind) {
    volumeScrubBind.style.backgroundSize = (volume * 100) / 1 + "% 100%";
  }
  $: if ($songPlaying == true) {
    scrubBind.style.backgroundSize = (time * 100) / duration - 0 + "% 100%";
  } else if (scrubBind) {
    scrubBind.style.backgroundSize = "0% 100%";
  }

  $: if (time === duration) trackEnded();
  //todo - Here will be the same, so when songsQueued is coded to object[] pass _.songurl (or better naming).
  //? This code is important, as it listens for state changes and downloads + plays the song.
  $: if ($songsQueued.length > 0) downloadSong($songsQueued[0].songUrl);
</script>

{#if isOpen}
  <section
    in:fly={{ y: 200, duration: 1500 }}
    out:fly={{ y: 400, duration: 1500 }}
    class="player-wrapper"
  >
    <div class="controls">
      <div class="scrub">
        <p>{formatTime(time)}</p>
        <input
          disabled={!$songPlaying}
          type="range"
          bind:this={scrubBind}
          bind:value={time}
          min="0"
          max={duration}
        />
        <p>{formatTime(duration)}</p>
      </div>
      <div class="buttons-grid">
        <div class="song-details">
          <div>
            <Playerdisc {paused} />
          </div>
          <div class="song-details-buttons">
            <button
              use:tooltip={{ content: "Close and Clear Queue" }}
              class="bs-icon-button"
              on:click={endPlayer}
            >
              <XCircle class="bs-icon" />
            </button>
            <button
              use:tooltip={{ content: "Hide Player (coming soon)" }}
              class="bs-icon-button"
            >
              <EyeSlash class="bs-icon" />
            </button>
          </div>
        </div>
        <div class="play-buttons">
          <button
            class="bs-icon-button"
            disabled={$songsPlayed.length >= 1 ? false : true}
            use:tooltip={{ content: "Backward" }}
            on:click={handleBack}
          >
            <SkipBackward class="bs-icon" style="width: 2rem; height: 100%;" />
          </button>
          <button
            class="bs-icon-button"
            on:click={() => (paused ? audioBind.play() : audioBind.pause())}
          >
            {#if paused}
              <Play class="bs-icon" style="width: 2rem; height: 100%;" />
            {:else}
              <Pause class="bs-icon" style="width: 2rem; height: 100%;" />
            {/if}
          </button>

          <button
            class="bs-icon-button"
            disabled={$songsQueued.length > 1 ? false : true}
            use:tooltip={{ content: "Forward" }}
            on:click={handleForward}
          >
            <SkipForward class="bs-icon" style="width: 2rem; height: 100%;" />
          </button>
        </div>
        <div class="volume">
          <article class="volume-control">
            {#if volume === 0}
              <button
                disabled={!$songPlaying}
                class="default-button"
                on:click={() => (volume = 0)}
              >
                <VolumeMute fill="var(--text-color)" />
              </button>
            {:else}
              <button
                disabled={!$songPlaying}
                class="default-button"
                on:click={() => (volume = 0)}
              >
                <VolumeUp fill="var(--text-color)" />
              </button>
            {/if}
            <input
              disabled={!$songPlaying}
              type="range"
              bind:this={volumeScrubBind}
              bind:value={volume}
              max="1"
              step="0.01"
            />
          </article>
        </div>
      </div>

      <audio
        bind:this={audioBind}
        bind:volume
        bind:paused
        bind:currentTime={time}
        bind:duration
      >
        Your browser does not support the audio element.
      </audio>
    </div>
  </section>
{/if}

<style>
  .player-wrapper {
    display: block;
    position: fixed;
    margin-left: 0;
    padding: 0.1rem 0.1rem;
    bottom: 0;
    left: 0;
    width: 100%;
    border-radius: 1rem 0px 0px 0px;
    background-color: var(--fg-color);
    color: var(--text-color);
    box-shadow: 0px 0px 0.5rem var(--accent-color);
  }

  @media only screen and (min-width: 1024px) {
    .player-wrapper {
      padding: 0.25rem 0.5rem;
      margin-left: 250px;
      width: calc(100% - 250px);
    }
  }

  .controls {
    display: block;
    position: relative;
  }

  .scrub {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .buttons-grid {
    display: grid;
    grid-template-columns: 25% 50% 25%;
    justify-content: center;
    align-items: center;
  }

  .song-details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .song-details-buttons {
    display: flex;
    gap: 0.1rem;
  }

  .play-buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    column-gap: 0.25rem;
  }

  .volume-control {
    /* border: 1px solid green; */

    width: 100%;
    align-items: center;

    display: flex;
  }

  @media only screen and (min-width: 768px) {
    .play-buttons {
      column-gap: 0.5rem;
    }
  }
</style>
