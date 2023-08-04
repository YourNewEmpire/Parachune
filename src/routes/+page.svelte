<script lang="ts">
  import type { PageData } from "./$types";
  import { fly, fade } from "svelte/transition";
  import { quintOut, elasticOut, quintIn } from "svelte/easing";
  import { onMount } from "svelte";
  import { Icon, WrenchScrewdriver } from "svelte-hero-icons";

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
<section class="col-container">
  <h1 class="welcome-text">
    {#each lines as line, i}
      <p>
        {line}
      </p>
    {/each}
  </h1>

  {#if animate}
    <article
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
        <a class="styled-button" href="/login">Login and Upload music</a>
      {/if}
    </article>
    <article
      style="display:flex; align-items:center; max-width:fit-content; column-gap: 6px; color: orange; "
      in:fade={{ delay: 500, easing: quintIn }}
    >
      <Icon class="icon" src={WrenchScrewdriver} /> In Early Development
    </article>
  {/if}
</section>

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
