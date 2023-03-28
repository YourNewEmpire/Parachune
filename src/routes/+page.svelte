<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;
  $: ({ message, session } = data);
</script>

<svelte:head>
  <title>Connected Music</title>
</svelte:head>

<div class="row-container">
  {message}
  {#if !session}
    <a class="styled-button" href="/login">Click to login and upload music.</a>
  {/if}
</div>
