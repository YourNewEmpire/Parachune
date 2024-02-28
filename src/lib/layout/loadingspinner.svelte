<script lang="ts">
  import { scale } from "svelte/transition";
  import Boombox from "svelte-bootstrap-icons/lib/Boombox.svelte";

  export let isLoading: boolean;
</script>

{#if isLoading}
  <div
    style="position: absolute; left: 2vh; top: 2vh; margin: 0"
    in:scale={{ duration: 300 }}
  >
    <Boombox class="bs-icon" style="animation: spin 2s linear infinite;" />
  </div>
{/if}
