<script lang="ts">
  import { quintIn } from "svelte/easing";
  import { Icon } from "svelte-hero-icons";
  import FlyInView from "$lib/transitions-inview/fly.svelte";
  import FadeInView from "$lib/transitions-inview/fade.svelte";
  import type { HeroProps } from "./heroItems";
  export let props: HeroProps;
  let { icon, heading, text } = props;
</script>

<section class="tutorial-section">
  <FlyInView
    options={{
      opacity: 0,
      x: -400,
      delay: 250,
      easing: quintIn,
      duration: 750,
    }}
  >
    <article class="tutorial-icon-container">
      <Icon src={icon} />
    </article>
  </FlyInView>

  <FadeInView
    options={{
      delay: 1000,
      duration: 500,
    }}
  >
    <article class="overflow tutorial-text">
      <h1 class="heading">
        {heading}
        <hr />
      </h1>

      <p>
        {text}
      </p>
    </article>
  </FadeInView>
</section>

<style>
  p {
    line-height: 2ch;
  }
  .overflow {
    display: inline-block;
    overflow: hidden;
    vertical-align: bottom;
  }

  .tutorial-section {
    min-height: 100vh;
    margin-top: 2rem;
    display: flex;
    align-items: center;
    flex-direction: column;
    /* border: 1px solid red; */
  }

  .tutorial-icon-container {
    width: 5rem;
    /* border: 1px solid red; */
  }
  .tutorial-text {
    text-align: center;
    & h1 {
      font-size: 2rem;
    }
    & p {
      font-size: 1.25rem;
    }
    & hr {
      border: none;
      overflow: visible;
      text-align: center;
      height: 5px;
      border-top: 0.1rem dotted white;
    }
  }
  @media only screen and (min-width: 768px) {
    .tutorial-icon-container {
      width: 10rem;
      /* border: 1px solid red; */
    }
    .tutorial-text > h1 {
      font-size: 2.5rem;
    }
    .tutorial-text > p {
      font-size: 1.5rem;
    }
  }
  @media only screen and (min-width: 1024px) {
    .tutorial-text > h1 {
      font-size: 2.75rem;
    }
    .tutorial-text > p {
      font-size: 1.75rem;
    }
  }
</style>
