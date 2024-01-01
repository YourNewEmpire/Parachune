<script lang="ts">
  import type { PageData } from "./$types";
  import SongCard from "$lib/songcard.svelte";
  import AvatarIcon from "$lib/avataricon.svelte";
  export let data: PageData;
  let { songData, profileData } = data;
</script>

<svelte:head>
  <title>Discover Music - Parachune</title>
</svelte:head>
<section>
  <h1>Discover Music</h1>
  <section class="card-container">
    {#each songData ?? [] as song}
      <SongCard {song} />
    {/each}
  </section>
  <article style="justify-content: center; display: flex; margin-top: 1rem;">
    <a class="styled-button" style="width:fit-content" href="/songs"
      >Find all songs
    </a>
  </article>
</section>
<section>
  <h1>Discover Artists</h1>
  <section class="card-container">
    {#each profileData ?? [] as profile}
      <a href="/profiles/{profile.id}" class="link-card col-container">
        <AvatarIcon
          altText={profile.username ?? "Unkown user"}
          size={10}
          url={profile.avatar_url ?? ""}
        />
        <h1>{profile.username}</h1>
      </a>
    {/each}
  </section>
  <article style="justify-content: center; display: flex; margin-top: 1rem;">
    <a class="styled-button" style="width:fit-content" href="/profiles"
      >Find all artists
    </a>
  </article>
</section>
