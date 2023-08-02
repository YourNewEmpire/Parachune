<script lang="ts">
  import SongCard from "$lib/songcard.svelte";
  import type { PageData } from "./$types";
  import { page } from "$app/stores";

  export let data: PageData;
  let { songList, totalSongs } = data;
  let pageSize = 10;
  $: totalItems = totalSongs ?? 0;
  $: totalPages = Math.ceil(totalItems / pageSize);
  $: currentPage = (Number($page.url.searchParams.get("skip")) || 0) / pageSize;
</script>

<div>
  <h1>All Songs</h1>
  <section class="card-container">
    {#each songList ?? [] as song}
      <SongCard {song} />
    {/each}
  </section>
  {#if totalPages >= 2}
    <nav style="display: flex; flex-direction: row; column-gap: 2px;">
      {#each Array(totalPages) as _, idx}
        <a
          data-sveltekit-reload
          href="/songs?limit={pageSize * idx + pageSize}&skip={pageSize * idx}"
          class="styled-link"
          style=" {currentPage === idx
            ? 'text-decoration: underline; color: #856bdc; font-size: 2em'
            : 'font-size: 2em'} "
        >
          {idx + 1}
        </a>
      {/each}
    </nav>
  {/if}
</div>

<style>
  .card-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, 250px);
    grid-gap: 12px;
    justify-content: center;
  }
  @media only screen and (min-width: 1024px) {
    .card-container {
      justify-content: start;
    }
  }
</style>
