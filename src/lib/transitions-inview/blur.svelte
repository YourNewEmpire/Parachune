<script lang="ts">
  //@ts-nocheck
  // No checking because on:enterViewport has weird types. I have no clue
  import { cubicInOut } from "svelte/easing";
  import { type BlurParams, blur } from "svelte/transition";
  import viewport from "$lib/utils/useViewportAction";

  export let options: BlurParams = {
    delay: 100,
    duration: 400,
    easing: cubicInOut,
    opacity: 0,
    amount: 5,
  };
  export let outOptions: BlurParams | "static" | "off" = "off";

  let visible = false;

  const open = () => {
    visible = true;
  };

  const close = () => {
    visible = false;
  };
</script>

{#if outOptions === "static"}
  <div
    use:viewport
    on:enterViewport={() => open()}
    on:exitViewport={() => close()}
  >
    {#if visible}
      <div in:blur={options}>
        <slot />
      </div>
    {/if}
  </div>
{:else if outOptions !== "off"}
  <div
    use:viewport
    on:enterViewport={() => open()}
    on:exitViewport={() => close()}
  >
    {#if visible}
      <div in:blur={options} out:blur={outOptions}>
        <slot />
      </div>
    {/if}
  </div>
{:else}
  <div use:viewport on:enterViewport={() => open()}>
    {#if visible}
      <div in:blur={options}>
        <slot />
      </div>
    {/if}
  </div>
{/if}
