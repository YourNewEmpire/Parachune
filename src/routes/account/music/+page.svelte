<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageData } from "./$types";
  export let data: PageData;

  let { session, profile, dbData } = data;
  let uploadForm: any;
  let loading = false;
  let formSuccess = false;
</script>

<div>
  <h1>Songs for {profile?.username ?? session?.user.email}</h1>
  {#each dbData as song}
    <div class="card">
      {song.name}
    </div>
  {/each}
</div>
