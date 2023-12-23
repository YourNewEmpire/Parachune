<script lang="ts">
  import type { PageData } from "./$types";
  import { fly, fade } from "svelte/transition";
  import { quartIn, quintIn } from "svelte/easing";
  import { onMount } from "svelte";
  import { Icon, WrenchScrewdriver } from "svelte-hero-icons";
  import { heroItems } from "$lib/home/heroItems";
  import Hero from "$lib/home/hero.svelte";
  export let data: PageData;
  $: ({ message, session } = data);

  const lines = ["Get Ready", "For", "Parachune", "🪂🎸"];

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

<section class="landing-section">
  {#if animate}
    <article class="welcome-title">
      {#each lines as line, i}
        <div class="">
          <h1
            in:fly|global={{
              y: i % 2 === 0 ? 100 : -100,
              delay: 400 * i,
            }}
          >
            {line}
          </h1>
        </div>
      {/each}
    </article>

    <article
      class="welcome-message"
      in:fly={{
        y: 100,
        delay: 500 * lines.length,
        duration: 1000,
      }}
    >
      <p>
        {message}
      </p>
    </article>
    <article
      style="display:flex; align-items:center; max-width:fit-content; column-gap: 0.5rem; color: orange; "
      in:fly={{
        y: -50,
        opacity: 0,
        delay: 600 * lines.length,
        duration: 2000,
      }}
    >
      <Icon class="icon" src={WrenchScrewdriver} /> In Early Development
    </article>
  {/if}
</section>
{#each heroItems as h}
  <Hero props={h} />
{/each}

<style>
  p {
    line-height: 2ch;
  }

  .landing-section {
    height: 100svh;
    /* border: 1px solid red; */
    display: flex;
    flex-direction: column;
    row-gap: 0.25rem;
    align-items: center;
    justify-content: center;
  }

  .welcome-title {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: 2fr;
    justify-content: center;
    align-items: center;
    /* border: 1px solid red; */
    text-align: center;
    font-size: 1rem;
  }

  .welcome-message {
    text-align: center;
    font-size: 0.75rem;
  }

  @media only screen and (min-width: 768px) {
    .welcome-title {
      /* border: 1px solid red; */
      font-size: 1.5rem;
    }
    .welcome-message {
      font-size: 1rem;
    }
  }

  @media only screen and (min-width: 1024px) {
    .welcome-title {
      /* border: 1px solid red; */
      font-size: 2rem;
    }
    .welcome-message {
      font-size: 1.5rem;
    }
  }
</style>
