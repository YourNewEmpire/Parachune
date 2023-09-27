<script lang="ts">
  import { Icon, Star } from "svelte-hero-icons";
  import { addToast } from "$lib/stores";

  export let songId: string;
  export let songUrl: string;
  async function saveSong() {
    const response = await fetch("/api/savesong", {
      method: "POST",
      body: JSON.stringify({ songId, songUrl }),
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
  <button data-tooltip="Add to Saved" class="styled-button" on:click={saveSong}>
    <Icon style="width: 2rem;" src={Star} />
  </button>
</div>

<style></style>
