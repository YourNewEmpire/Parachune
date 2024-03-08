<script lang="ts">
  import type { PageData } from "./$types";
  import { fly, scale } from "svelte/transition";
  import Tools from "svelte-bootstrap-icons/lib/Tools.svelte";
  import { onMount } from "svelte";
  import { heroItems } from "$lib/home/heroItems";
  import Hero from "$lib/home/hero.svelte";
  import Platformdonate from "$lib/platformdonate.svelte";
  export let data: PageData;
  $: ({ message } = data);

  const topLines = ["Welcome", "To"];

  let animate = false;
  onMount(() => {
    setTimeout(() => {
      animate = true;
    }, 500);
  });
</script>

<svelte:head>
  <title>Parachune</title>
  <meta
    name="description"
    content="Parachune music app. Parachute your tunes here for free. Listen for free."
  />
  <meta
    name="keywords"
    content="music, free, crowdfunded, music player, upload"
  />
</svelte:head>

<section class="landing-section">
  {#if animate}
    <article class="title">
      <article class="title-small">
        <p
          in:fly={{
            y: -100,
            delay: 0,
            duration: 500,
          }}
        >
          {topLines[0]}
        </p>
        <p
          in:fly|global={{
            y: 100,
            delay: 500,
            duration: 500,
          }}
        >
          {topLines[1]}
        </p>
      </article>
      <p class="title-large" in:scale|global={{ delay: 1000, duration: 1000 }}>
        PARACHUNE
      </p>
    </article>

    <article
      class="welcome-message"
      in:fly={{
        y: 100,
        delay: 2000,
        duration: 1000,
      }}
    >
      <p>
        {message}
      </p>
    </article>

    <article
      in:fly={{
        y: -50,
        opacity: 0,
        delay: 1500,
        duration: 2000,
      }}
      class="beta-notice"
    >
      <Tools fill="#ffa500" />
      In Early Development
    </article>
    <article in:scale={{ delay: 3000, duration: 2000 }}>
      <Platformdonate />
    </article>
  {/if}
</section>
{#each heroItems as h}
  <Hero props={h} />
{/each}

<style>
  .landing-section {
    height: 100svh;

    /* border: 1px solid red; */
    display: flex;
    flex-direction: column;
    row-gap: 0.25rem;
    align-items: center;
    justify-content: center;
  }

  .title {
    line-height: 0;
  }

  .welcome-message {
    text-align: center;
  }

  .title-small {
    font-size: 1.25rem;
    display: flex;
    flex-direction: row;
    gap: 2.5%;
  }

  .title-large {
    font-family: Sono, sans-serif;
    font-weight: bold;
    font-size: 2.5rem;
    margin: 0.2rem 0 0;
    line-height: normal;
  }

  .beta-notice {
    display: flex;
    align-items: center;
    max-width: fit-content;
    gap: 0.5rem;
    color: orange;
    padding: 0.5rem;
    background-color: #000;
    border-radius: 0.75rem;
  }
  @media only screen and (min-width: 1024px) {
    .title-small {
      font-size: 2rem;
      display: flex;
      flex-direction: row;
      gap: 2.5%;
    }
    .title-large {
      font-family: Sono, sans-serif;
      font-weight: bold;
      font-size: 5rem;
      margin: 0.2rem 0 0;
      line-height: normal;
    }
  }
</style>
