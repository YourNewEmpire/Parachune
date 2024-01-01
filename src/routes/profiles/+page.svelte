<script lang="ts">
  import type { PageData } from "./$types";
  import AvatarIcon from "$lib/avataricon.svelte";

  export let data: PageData;
  let { profileList } = data;
</script>

<div>
  <h1>Find artists</h1>
  <section class="card-container">
    {#each profileList ?? [] as profile}
      <a href="/profiles/{profile.id}" class="link-card col-container">
        <AvatarIcon
          altText={profile.username ?? ""}
          size={10}
          url={profile.avatar_url ?? ""}
        />
        <h1>{profile.username}</h1>
      </a>
    {/each}
  </section>
</div>
