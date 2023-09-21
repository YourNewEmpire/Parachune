<script lang="ts">
  //@ts-nocheck
  // No checking because on:enterViewport has weird types. I have no clue
  import { linear } from "svelte/easing";
  import { type FadeParams, fade } from "svelte/transition";
  import viewport from "$lib/utils/useViewportAction";

  export let options: FadeParams = {
    delay: 100,
    duration: 400,
    easing: linear,
  };
  export let outOptions: FadeParams | "static" | "off" = "off";

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
      <div in:fade={options}>
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
      <div in:fade={options} out:fade={outOptions}>
        <slot />
      </div>
    {/if}
  </div>
{:else}
  <div use:viewport on:enterViewport={() => open()}>
    {#if visible}
      <div in:fade={options}>
        <slot />
      </div>
    {/if}
  </div>
{/if}
