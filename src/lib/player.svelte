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
    Plus,
    Minus,
  } from "svelte-hero-icons";
  import type { SupabaseClient } from "@supabase/supabase-js";
  import tooltip from "./utils/tooltip";

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
        <div>
          <button
            use:tooltip={{ content: "Close and Clear Queue" }}
            class="player-button"
            on:click={endPlayer}
          >
            <span class="main-icon">
              <Icon src={XCircle} />
            </span>
          </button>
        </div>
        <div class="play-buttons">
          <button
            class="player-button"
            disabled={$songsPlayed.length >= 1 ? false : true}
            use:tooltip={{ content: "Backward" }}
            on:click={handleBack}
          >
            <span class="main-icon">
              <Icon src={Backward} />
            </span>
          </button>
          <button
            class="player-button"
            use:tooltip={{ content: paused ? "Play" : "Pause" }}
            on:click={() => (paused ? audioBind.play() : audioBind.pause())}
          >
            <span class="main-icon">
              {#if paused}
                <Icon src={Play} />
              {:else}
                <Icon src={Pause} />
              {/if}
            </span>
          </button>

          <button
            class="player-button"
            disabled={$songsQueued.length > 1 ? false : true}
            use:tooltip={{ content: "Forward" }}
            on:click={handleForward}
          >
            <span class="main-icon">
              <Icon src={Forward} />
            </span>
          </button>
        </div>
        <div class="volume">
          <article class="volume-control">
            <input
              disabled={!$songPlaying}
              type="range"
              bind:this={volumeScrubBind}
              bind:value={volume}
              max="1"
              step="0.01"
            />
          </article>
          <article class="volume-increment">
            <button
              class="player-button"
              on:click={() => {
                if (volume - 0.1 >= 0) {
                  volume = Number.parseFloat((volume -= 0.1).toFixed(1));
                }
                return;
              }}
            >
              <span class="volume-icon">
                <Icon src={Minus} />
              </span>
            </button>
            <p style="text-align: center;">{(volume * 10).toFixed(1)}</p>
            <button
              class="player-button"
              on:click={() => {
                if (volume + 0.1 <= 1) {
                  volume = Number.parseFloat((volume += 0.1).toFixed(1));
                }
                return;
              }}
            >
              <span class="volume-icon">
                <Icon src={Plus} />
              </span>
            </button>
          </article>
        </div>
      </div>
    </div>

    <audio
      bind:this={audioBind}
      bind:volume
      bind:paused
      bind:currentTime={time}
      bind:duration
    >
      <source type="audio/mp3" />
      Your browser does not support the audio element.
    </audio>
  </section>
{/if}

<style>
  span {
    display: flex;
  }
  .player-wrapper {
    display: block;
    position: fixed;
    margin-left: 0;
    padding: 0.1rem 0.1rem;
    bottom: 0;
    left: 0;
    width: 100%;
    border-radius: 1rem 0px 0px 0px;
    background-color: #9898ac;
    box-shadow: 0px 0px 6px #856bdc;
    font-size: 0.75rem;
  }

  @media only screen and (min-width: 1024px) {
    .player-wrapper {
      font-size: 1rem;
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
    grid-template-columns: 30% 40% 30%;
    justify-content: center;
    align-items: center;
  }
  .play-buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    column-gap: 0.5rem;
  }
  .volume {
    gap: 0.3rem;
    display: flex;
    flex-direction: column;
  }
  .volume-control {
    align-items: center;
    justify-content: center;
    display: flex;
    width: 100%;
  }

  .volume-increment {
    width: 100%;
    display: grid;
    gap: 0.5rem;
    justify-content: center;
    align-items: center;
    grid-template-columns: 4fr 2fr 4fr;
  }

  .player-button {
    font-family: "Sono", sans-serif;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 0.1rem 0.1rem;
    background: none;
    color: inherit;
    text-decoration: none;
    cursor: pointer;
    border-radius: 0.5rem;
    transition: all 0.3s ease;
    border: 1px solid var(--primary-color);
  }
  .player-button:hover {
    background-color: var(--primary-color);
    box-shadow: 0px 0px 8px var(--primary-color);
  }
  .player-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .main-icon {
    width: 2rem;
  }
  .volume-icon {
    width: 1.5rem;
  }
  @media only screen and (min-width: 768px) {
    .player-button {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      padding: 0.5rem 0.5rem;
      background: none;
      color: inherit;
      text-decoration: none;
      cursor: pointer;
      border-radius: 0.75rem;
      transition: all 0.3s ease;
      border: 2px solid var(--primary-color);
    }
    .player-button:hover {
      background-color: var(--primary-color);
      box-shadow: 0px 0px 8px var(--primary-color);
    }
    .main-icon {
      width: 2.5rem;
    }
    .volume-icon {
      width: 1.5rem;
    }
  }

  @media only screen and (min-width: 1024px) {
    .player-button {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      padding: 0.5rem 0.5rem;
      background: none;
      color: inherit;
      text-decoration: none;
      cursor: pointer;
      border-radius: 0.75rem;
      transition: all 0.3s ease;
      border: 2px solid var(--primary-color);
    }
    .player-button:hover {
      background-color: var(--primary-color);
      box-shadow: 0px 0px 8px var(--primary-color);
    }
  }
</style>
