<script lang="ts">
  import type { PageData } from "./$types";
  import { fly, fade } from "svelte/transition";
  import { quartIn, quintIn } from "svelte/easing";
  import { onMount } from "svelte";
  import { Icon, WrenchScrewdriver } from "svelte-hero-icons";
  import FlyInView from "$lib/transitions-inview/fly.svelte";
  import FadeInView from "$lib/transitions-inview/fade.svelte";
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
    <div class="welcome-text">
      {#each lines as line, i}
        <div class="overflow">
          <h1
            style="display: inline-block;"
            in:fly|global={{
              y: i % 2 === 0 ? 100 : -100,
              delay: 400 * i,
            }}
          >
            {line}
          </h1>
        </div>
      {/each}
    </div>

    <article
      in:fly={{
        y: 100,
        delay: 500 * lines.length,
        easing: quintIn,
        duration: 1000,
      }}
      class="col-container"
      style="max-width: 50%;"
    >
      <p style="line-height: 2em; font-size: 1.5rem;">
        {message}
      </p>
      {#if !session}
        <a class="styled-button" href="/login">Login and Upload music</a>
      {/if}
    </article>
    <article
      style="display:flex; align-items:center; max-width:fit-content; column-gap: 6px; color: orange; "
      in:fade={{ delay: 550 * lines.length, easing: quartIn, duration: 2000 }}
    >
      <Icon class="icon" src={WrenchScrewdriver} /> In Early Development
    </article>
  {/if}
</section>

<section class="tutorial-section">
  <article class="overflow">
    <FlyInView
      options={{
        x: -200,
        delay: 500,
        easing: quintIn,
        duration: 800,
      }}
    >
      <h1 class="heading">Create your account</h1>
    </FlyInView>
  </article>

  <a href="/login" class="tutorial-image-container">
    <FadeInView
      options={{
        delay: 2000,
        duration: 1000,
      }}
    >
      <div
        style="position: absolute; bottom: 0; left: 12; color:black; font-size: 1.25rem;"
      >
        <p class="tutorial-text">
          * Create an account with Google (recommended) or with email
        </p>
      </div>
      <img src="create_acc.png" alt="create account" class="tutorial-image" />
    </FadeInView>
  </a>
</section>

<!-- <section class="tutorial-section">
  <article class="overflow">
    <FlyInView
      options={{
        x: -200,
        delay: 500,
        easing: quintIn,
        duration: 800,
      }}
    >
      <h1 class="heading">Upload your music</h1>
    </FlyInView>
  </article>

  <a href="/login" class="tutorial-image-container">
    <FadeInView
      options={{
        delay: 2000,
        duration: 1000,
      }}
    >
      <div
        style="position: absolute; bottom: 0; left: 12; color:black; font-size: 1.25rem;"
      >
        <p class="tutorial-text">
          * Create an account with Google (recommended) or with email
        </p>
      </div>
      <img src="create_acc.png" alt="create account" class="tutorial-image" />
    </FadeInView>
  </a>
</section> -->

<style>
  .heading {
    font-size: 2rem;
  }
  .overflow {
    display: inline-block;
    overflow: hidden;
    vertical-align: bottom;
  }
  .landing-section {
    min-height: 100vh;
    /* border: 1px solid red; */
    display: flex;
    flex-direction: column;
    row-gap: 2rem;
    align-items: center;
    justify-content: center;
  }
  .welcome-text {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: 1fr;
    justify-content: center;
    align-items: center;
    /* border: 1px solid red; */
    text-align: center;
    font-size: 2rem;
  }
  .tutorial-section {
    min-height: 100vh;
    margin-top: 0.5rem;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    /* border: 1px solid red; */
  }
  .tutorial-image-container {
    align-self: center;
    position: relative;
  }
  .tutorial-image-container:hover .tutorial-image {
    box-shadow: 0px 3px 50px var(--primary-color);
  }

  .tutorial-image {
    transition: all;
    transition-duration: 350ms;
    border-radius: 0.5rem;
    object-fit: cover;
    /* border: 1px solid red; */
  }
</style>
