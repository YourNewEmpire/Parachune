<script lang="ts">
  import Toast from "./toast.svelte";

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
    width: 40%;
    left: 60%;
    display: flex;
    padding-top: 1rem;
    row-gap: 12px;
    flex-direction: column;
    z-index: 10;
    padding-right: 1rem;
  }
  @media only screen and (min-width: 1024px) {
    section {
      width: 30%;
      left: 70%;
    }
  }
</style>
