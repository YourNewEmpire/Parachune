<script>
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
    <article class="text">
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
    border-radius: 0.5rem;
    color: white;
  }
  button:focus {
    outline: none;
  }
  .warning {
    background-color: rgba(242, 96, 5, 0.7);
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
