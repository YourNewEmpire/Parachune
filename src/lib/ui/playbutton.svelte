<script lang="ts">
  import { Icon, PlayCircle } from "svelte-hero-icons";
  import { addToast, songPlaying, songsQueued } from "$lib/stores";
  import tooltip from "$lib/utils/tooltip";
  import { type StoreSong } from "$lib/stores";

  export let songData: StoreSong;

  const playSong = () => {
    if (!songData.artistId || !songData.songUrl) {
      return addToast({
        dismissable: false,
        message:
          "There was a problem playing this song. Contact support if the issue persists after refreshes",
        timeout: 5000,
        type: "failure",
      });
    }
    $songPlaying = false;
    $songsQueued = [songData, ...$songsQueued.slice(1)];
  };
</script>

<div>
  <button
    class="styled-button"
    use:tooltip={{ content: "Play Now" }}
    on:click={playSong}
  >
    <Icon style="width: 2rem;" src={PlayCircle} />
  </button>
</div>
