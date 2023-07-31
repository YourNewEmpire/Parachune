<script lang="ts">
  import SongCard from "$lib/SongCard.svelte";
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
  <div class="card-col-container">
    {#each songList ?? [] as song}
      <SongCard {song} />
    {/each}
  </div>
  <div style="display: flex; flex-direction: row; column-gap: 2px;">
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
  </div>
</div>
