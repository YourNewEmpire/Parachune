<script lang="ts">
  import { Icon, Photo } from "svelte-hero-icons";
  import type { PageData } from "./$types";
  import AvatarIcon from "$lib/AvatarIcon.svelte";
  import Playbutton from "$lib/Playbutton.svelte";
  import Queuebutton from "$lib/Queuebutton.svelte";
  import Savebutton from "$lib/Savebutton.svelte";

  export let data: PageData;
  let { song, supabase, session } = data;

  async function setLike(payload: boolean) {
    const { data, error: likeError } = await supabase
      .from("song_likes")
      .upsert(
        { song_id: song.id, user_id: session?.user.id, liked: payload },
        { onConflict: "song_id, user_id" }
      )
      .select();
    console.log(likeError);
  }
</script>

<div>
  <h1>
    {song.name} by
    <a href="/profiles/{song.profiles.username}" class="styled-link">
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
      <a href="/profiles/{song.profiles.username}">
        <AvatarIcon size={5} url={song.profiles.avatar_url} />
      </a>
      <p>"{song.description}"</p>
    </article>
  </section>
  <h1>Reviews & Likes</h1>
  <section class="grid-1">
    <article class="card">
      <h1>reviews</h1>
    </article>
    <article class="card">
      likes: dislikes:
      <button on:click={() => setLike(true)}> like</button>
      <button on:click={() => setLike(false)}> dislike</button>
    </article>
  </section>
</div>

<style>
  .grid-1 {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(2, 1fr);
    grid-gap: 12px;
    justify-content: center;
  }
  @media only screen and (min-width: 1024px) {
    .grid-1 {
      grid-template-rows: 1fr;
      grid-template-columns: 3fr 1fr;
    }
  }
</style>
