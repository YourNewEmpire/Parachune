<script lang="ts">
  import { Icon, Bars3CenterLeft } from "svelte-hero-icons";
  import { addToast, songsQueued } from "$lib/stores";
  import tooltip from "./utils/tooltip";
  import { type StoreSong } from "$lib/stores";

  export let songData: StoreSong;

  const addToQueue = () => {
    $songsQueued = [...$songsQueued, songData];
    addToast({
      timeout: 2000,
      dismissable: true,
      message: "Added a song to queue",
      type: "info",
    });
  };
</script>

<div>
  <button
    class="styled-button"
    use:tooltip={{ content: "Add To Queue" }}
    on:click={addToQueue}
  >
    <Icon style="width: 2rem;" src={Bars3CenterLeft} />
  </button>
</div>
