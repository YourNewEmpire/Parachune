<script>
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
  import {
    Icon,
    ExclamationCircle,
    CheckCircle,
    InformationCircle,
    XCircle,
  } from "svelte-hero-icons";
  const dispatch = createEventDispatcher();

  export let type = "failure";
  export let dismissable = true;
</script>

<div class={type} role="alert" transition:fade>
  {#if type === "success"}
    <Icon src={CheckCircle} style="width: 2rem;" />
  {:else if type === "failure"}
    <Icon src={ExclamationCircle} style="width: 2rem;" />
  {:else}
    <Icon src={InformationCircle} style="width: 2rem; " />
  {/if}

  <div class="text">
    <slot />
  </div>

  {#if dismissable}
    <button style="width: 3rem;" on:click={() => dispatch("dismiss")}>
      <Icon src={XCircle} />
    </button>
  {/if}
</div>

<style>
  div {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    color: white;
  }
  .failure {
    background-color: rgba(255, 0, 0, 0.7);
  }
  .success {
    background-color: rgba(0, 255, 0, 0.7);
  }
  .info {
    background-color: rgba(0, 0, 255, 0.7);
  }
  .text {
  }

  button {
    color: inherit;
    transition: all 0.2s ease-in-out;
  }
  button:hover {
    scale: 1.2;
  }
</style>
