<script lang="ts">
  import { fade } from "svelte/transition";

  export let key: string;
  export let duration: number = 200;
</script>

<div class="transition-outer">
  {#key key}
    <div
      class="transition-inner"
      in:fade={{ duration, delay: duration }}
      out:fade={{ duration: duration / 2 }}
    >
      <slot />
    </div>
  {/key}
</div>

<style>
  .transition-outer {
    display: grid;
    grid-template: 1fr 1fr;
  }
  .transition-inner {
    grid-row: 1;
    grid-column: 1;
  }
</style>
