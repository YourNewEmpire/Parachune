<script lang="ts">
  import type { PageData } from "./$types";
  import { fly } from "svelte/transition";
  import { quintOut, elasticOut, quintIn } from "svelte/easing";
  import { onMount } from "svelte";

  export let data: PageData;
  $: ({ message, session } = data);

  const lines = ["Get Ready", "For", "ParaTune", "🪂🎸"];

  let animate = false;
  onMount(() => {
    setTimeout(() => {
      animate = true;
    }, 500);
  });
</script>

<svelte:head>
  <title>Parachune</title>
</svelte:head>
<div class="col-container">
  <h1 class="welcome-text">
    {#each lines as line, i}
      <p>
        {line}
      </p>
    {/each}
  </h1>

  {#if animate}
    <div
      in:fly={{
        y: 300,
        delay: 100,
        easing: quintIn,
      }}
      class="col-container"
    >
      <p style="line-height: 2em;">
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

    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    align-items: start;
    /* border: 1px solid red; */
    justify-content: center;
  }
</style>
