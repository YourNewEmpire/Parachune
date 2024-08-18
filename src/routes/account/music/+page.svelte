<script lang="ts">
  import Songcard from "$lib/ui/songcard.svelte";
  import type { PageData } from "./$types";
  export let data: PageData;

  let { dbData, profile } = data;
</script>

<h1>Your music</h1>
<section class="card-container">
  {#each dbData ?? [] as song}
    <Songcard
      song={{ ...song, profiles: { username: profile?.username ?? "" } }}
    />
  {/each}
</section>
