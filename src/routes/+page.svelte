<script lang="ts">
  import type { PageData } from "./$types";
  import { fly } from "svelte/transition";
  import { quintOut, elasticOut } from "svelte/easing";
  import { onMount } from "svelte";

  export let data: PageData;
  $: ({ message, session } = data);

  const lines = ["Get Ready", "For", "Musify", "🎸"];

  let animate = false;
  onMount(() => {
    setTimeout(() => {
      animate = true;
    }, 500);
  });
</script>

<svelte:head>
  <title>Connected Music</title>
</svelte:head>
<div class="col-container">
  {#if animate}
    <div class="welcome-text">
      {#each lines as line, i}
        <h1
          in:fly={{
            y: 100,
            delay: 500 * i,
            easing: elasticOut,
          }}
        >
          {line}
        </h1>
      {/each}
    </div>
    <div
      in:fly={{
        y: 300,
        delay: 600 * lines.length,
        easing: quintOut,
      }}
      class="row-container"
    >
      <p>
        {message}
      </p>
      {#if !session}
        <a class="styled-button" href="/login"
          >Click to login and upload music</a
        >
      {/if}
    </div>
  {/if}
</div>

<style>
  .welcome-text {
    text-align: center;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    align-items: center;
    justify-content: center;
  }
</style>
