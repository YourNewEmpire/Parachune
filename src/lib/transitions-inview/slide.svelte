<script lang="ts">
  //@ts-nocheck
  // No checking because on:enterViewport has weird types. I have no clue
  import { cubicOut } from "svelte/easing";
  import { type SlideParams, slide } from "svelte/transition";
  import viewport from "$lib/utils/useViewportAction";

  export let options: SlideParams = {
    delay: 0,
    duration: 400,
    easing: cubicOut,
    axis: "y",
  };
  export let outOptions: SlideParams | "static" | "off" = "off";

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
      <div in:slide={options}>
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
      <div in:slide={options} out:slide={outOptions}>
        <slot />
      </div>
    {/if}
  </div>
{:else}
  <div use:viewport on:enterViewport={() => open()}>
    {#if visible}
      <div in:slide={options}>
        <slot />
      </div>
    {/if}
  </div>
{/if}
