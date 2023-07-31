<script lang="ts">
  import type { PageData } from "./$types";
  import AvatarIcon from "$lib/AvatarIcon.svelte";

  export let data: PageData;
  let { profileList } = data;
</script>

<div>
  <h1>Find artists</h1>
  <div class="row-container">
    {#each profileList ?? [] as profile}
      <div class="col-container card">
        <AvatarIcon size={10} url={profile.avatar_url} />
        <p>{profile.username}</p>
      </div>
    {/each}
  </div>
</div>
