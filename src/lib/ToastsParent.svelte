<script lang="ts">
  import Toast from "./Toast.svelte";

  import { dismissToast, toasts } from "./stores";
</script>

{#if $toasts}
  <section>
    {#each $toasts as toast (toast.id)}
      <Toast
        type={toast.type}
        dismissable={toast.dismissable}
        on:dismiss={() => dismissToast(toast.id)}>{toast.message}</Toast
      >
    {/each}
  </section>
{/if}

<style>
  section {
    position: fixed;

    top: 0;
    left: 25%;
    right: 0;
    width: 50%;
    display: flex;
    margin-top: 1rem;
    row-gap: 12px;
    flex-direction: column;
    z-index: 10;
  }
  @media only screen and (min-width: 1024px) {
    section {
      position: fixed;
      top: 0;
      left: 75%;
      right: 0;
      width: 25%;
      display: flex;
      margin-top: 1rem;
      row-gap: 12px;
      flex-direction: column;
      z-index: 10;
    }
  }
</style>
