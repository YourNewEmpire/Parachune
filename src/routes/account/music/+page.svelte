<script lang="ts">
  import type { PageData } from "./$types";
  export let data: PageData;

  let { session, profile, dbData } = data;
</script>

<div>
  <h1>Songs for {profile?.username ?? session?.user.email}</h1>
  {#each dbData as song}
    <div class="card">
      {song.name}
    </div>
  {/each}
</div>
