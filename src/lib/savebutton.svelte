<script lang="ts">
  import { Icon, Star } from "svelte-hero-icons";

  export let songId: number;

  async function saveSong() {
    const response = await fetch("/api/savesong", {
      method: "POST",
      body: JSON.stringify({ songId }),
      headers: {
        "content-type": "application/json",
      },
    });

    let data = await response.json();
    console.log(data);
  }
</script>

<div>
  <button class="styled-button" on:click={saveSong}
    ><Icon style="width: 2rem;" src={Star} /></button
  >
</div>

<style></style>
