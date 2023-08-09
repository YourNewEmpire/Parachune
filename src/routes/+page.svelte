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
  <section class="welcome-text">
    {#each lines as line, i}
      <article>
        <h1>
          {line}
        </h1>
      </article>
    {/each}
  </section>

  {#if animate}
    <article
      in:fly={{
        y: 300,
        delay: 100,
        easing: quintIn,
      }}
      class="col-container"
    >
      <p style="line-height: 2em; font-size: 1.25rem;">
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
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: 1fr;
    justify-content: center;
    align-items: start;
    /* border: 1px solid red; */
    text-align: center;
    font-size: 2rem;
  }
</style>
