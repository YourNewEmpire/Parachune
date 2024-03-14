<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

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
    <article class="toast-text">
      <slot />
    </article>
  </button>
</div>

<style>
  button {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 1rem;
    border: 0.2rem solid;
    border-radius: 0.5rem;
    color: var(--text-color);
    background-color: var(--fg-color);
  }
  button:focus {
    outline: none;
  }

  .warning {
    border-color: rgba(242, 159, 5, 0.7);
  }
  .failure {
    border-color: rgba(255, 0, 0, 0.7);
  }
  .success {
    border-color: rgba(0, 255, 0, 0.7);
  }
  .info {
    border-color: rgba(0, 0, 255, 0.7);
  }
</style>
