<script lang="ts">
  import { Icon, Star, MinusCircle } from "svelte-hero-icons";
  import { addToast } from "$lib/stores";
  import tooltip from "$lib/utils/tooltip";

  export let songId: string;
  export let songUrl: string;
  export let unSave: boolean = false;
  async function saveSong() {
    const response = await fetch("/api/savesong", {
      method: "POST",
      body: JSON.stringify({ songId, songUrl, unSave: unSave ? true : false }),
      headers: {
        "content-type": "application/json",
      },
    });

    let data = await response.json();

    addToast({
      type: data.toastType,
      message: data.message,
      dismissable: true,
      timeout: 3000,
    });
  }
</script>

<div>
  <button
    class="styled-button"
    use:tooltip={{ content: unSave ? "Remove from Saved" : "Add to Saved" }}
    on:click={saveSong}
  >
    <Icon style="width: 2rem;" src={unSave ? MinusCircle : Star} />
  </button>
</div>

<style></style>
