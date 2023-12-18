<script lang="ts">
  import { Icon, Photo } from "svelte-hero-icons";
  import type { PageData } from "./$types";
  import AvatarIcon from "$lib/avataricon.svelte";
  import Playbutton from "$lib/playbutton.svelte";
  import Queuebutton from "$lib/queuebutton.svelte";
  import Savebutton from "$lib/savebutton.svelte";

  export let data: PageData;
  let { song } = data;
</script>

<div>
  <h1>
    {song.name} by
    <a href="/profiles/{song.profiles.id}" class="styled-link">
      {song.profiles.username}
    </a>
  </h1>
  <section class="grid-1">
    <article
      class="card"
      style=" display:flex; flex-direction:column; align-items:center; justify-content: center; "
    >
      <div
        class="song-image"
        style="height: 12em; width: 12em; border-radius: 50%;  background-color: grey;"
      >
        <Icon src={Photo} />
      </div>

      <p>Song/Album photo coming soon with albums</p>
      <article class="row-container">
        <Playbutton songUrl={song.song_url} />

        <Queuebutton songUrl={song.song_url} />

        <Savebutton songId={song.id} songUrl={song.song_url} />
      </article>
    </article>
    <article class="card">
      <a href="/profiles/{song.profiles.id}">
        <AvatarIcon
          altText={song.profiles.username}
          size={5}
          url={song.profiles.avatar_url}
        />
      </a>
      <p>"{song.description}"</p>
    </article>
  </section>
</div>

<style>
  .grid-1 {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(2, 1fr);
    gap: 1rem;
    justify-content: center;
  }
  @media only screen and (min-width: 1024px) {
    .grid-1 {
      grid-template-rows: 1fr;
      grid-template-columns: 3fr 1fr;
    }
  }
</style>
