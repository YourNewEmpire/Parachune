<script lang="ts">
  import { Icon, Bars3CenterLeft } from "svelte-hero-icons";
  import { addToast, songsQueued } from "$lib/stores";
  import tooltip from "./utils/tooltip";

  export let songUrl: string;

  const addToQueue = (newUrl: string) => {
    $songsQueued = [...$songsQueued, newUrl];
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
    on:click={() => addToQueue(songUrl)}
  >
    <Icon style="width: 2rem;" src={Bars3CenterLeft} />
  </button>
</div>
