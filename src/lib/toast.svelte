<script>
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
  import {
    Icon,
    ExclamationCircle,
    CheckCircle,
    InformationCircle,
    ExclamationTriangle,
  } from "svelte-hero-icons";

  const dispatch = createEventDispatcher();

  export let type = "failure";
  export let dismissable = true;

  const handleDismiss = () => {
    if (dismissable) dispatch("dismiss");
    return;
  };
</script>

<div role="alert" transition:fade>
  <button class={type} on:click={() => handleDismiss()}>
    {#if type === "success"}
      <Icon src={CheckCircle} class="icon" />
    {:else if type === "failure"}
      <Icon src={ExclamationCircle} class="icon" />
    {:else if type === "info"}
      <Icon src={InformationCircle} class="icon" />
    {:else}
      <Icon src={ExclamationTriangle} class="icon" />
    {/if}
    <article class="text">
      <slot />
    </article>
  </button>
</div>

<style>
  button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    color: white;
  }
  button:focus {
    outline: none;
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
    font-size: 1.25rem;
    overflow-wrap: break-word;
    flex: 3;
  }
  .icon {
    width: 1.25rem;
    flex: 1;
  }
</style>
