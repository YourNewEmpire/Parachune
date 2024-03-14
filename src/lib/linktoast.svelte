<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  const dispatch = createEventDispatcher();

  export let type = "failure";
  export let link = "";
  const handleGoto = () => {
    if (link === $page.url.pathname) {
      window.location.reload();
    }
    goto(link, { invalidateAll: true });
    dispatch("dismiss");
    return;
  };
</script>

<div role="alert" class={type} transition:fade>
  <article class="toast-text">
    <p>
      <slot />
    </p>
  </article>
  <article class="buttons">
    <button class="styled-button" on:click={handleGoto}>Go to page</button>
    <button class="styled-button" on:click={() => dispatch("dismiss")}>
      Not now
    </button>
  </article>
</div>

<style>
  div {
    flex-direction: column;
    display: flex;
    align-items: center;
    width: 100%;
    padding: 1rem;
    border-radius: 0.5rem;
    color: var(--text-color);
    background-color: var(--fg-color);
    border: 0.2rem solid;
  }
  .buttons {
    display: flex;
    flex-direction: row;
    gap: 0.2rem;
  }
  button:focus {
    outline: none;
  }
  .info-link {
    display: flex;
    flex-direction: column;
  }
  .info-link-buttons {
    display: flex;
    flex-direction: row;
  }
  .warning {
    border-color: rgba(242, 96, 5, 0.7);
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
