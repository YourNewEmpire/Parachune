<script lang="ts">
  import Songcard from "$lib/songcard.svelte";
  import type { PageData } from "./$types";
  export let data: PageData;

  let { dbData } = data;
</script>

<h1>Your music</h1>
<section class="card-container">
  {#each dbData ?? [] as song}
    <Songcard {song} />
  {/each}
</section>
