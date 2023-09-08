<script lang="ts">
  import { Icon, Photo } from "svelte-hero-icons";
  import type { PageData } from "./$types";
  import AvatarIcon from "$lib/AvatarIcon.svelte";
  import Playbutton from "$lib/Playbutton.svelte";
  import Queuebutton from "$lib/Queuebutton.svelte";
  import Savebutton from "$lib/Savebutton.svelte";
  import { addToast } from "$lib/stores";

  export let data: PageData;
  let { song, supabase, session } = data;

  async function setLike(payload: boolean) {
    // TODO - fetch if the user has already liked this. using the isLiked state from song data
    if (!session) {
      addToast({
        dismissable: true,
        message:
          "You are not logged in, try refreshing and navigating to login",
        timeout: 5000,
        type: "failure",
      });
      return;
    }

    if (song.liked === payload) {
      const { error: delErr } = await supabase
        .from("song_likes")
        .delete()
        .eq("user_id", session?.user.id)
        .eq("song_id", song.id);
      //remove the row
      if (delErr) {
        addToast({
          dismissable: true,
          message: "Error removing like.",
          timeout: 5000,
          type: "failure",
        });
        return;
      }
      song.liked = null;
      addToast({
        dismissable: true,
        message: "Removed like",
        timeout: 5000,
        type: "info",
      });
      return;
    }
    const { data: likedUpdated, error: likeError } = await supabase
      .from("song_likes")
      .upsert(
        { song_id: song.id, user_id: session?.user.id, liked: payload },
        { onConflict: "song_id, user_id" }
      )
      .select();
    if (likeError) {
      addToast({
        dismissable: true,
        message: "error updating like",
        timeout: 5000,
        type: "failure",
      });
      return;
    }
    song.liked = likedUpdated[0].liked;
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
        <AvatarIcon
          altText={song.profiles.username}
          size={5}
          url={song.profiles.avatar_url}
        />
      </a>
      <p>"{song.description}"</p>
    </article>
  </section>
  <section>
    <h1>Reviews & Likes</h1>
    <div class="grid-1">
      <article class="card">
        <h1>reviews</h1>
      </article>
      <article class="card likes-container">
        <div class="likes">
          Likes: {song.likes}
        </div>
        {#if song.liked === true}
          <button
            class="like-button"
            data-tooltip="Click to remove like"
            on:click={() => setLike(true)}>Liked!</button
          >
          <button class="dislike-button" on:click={() => setLike(false)}
            >Dislike</button
          >
        {:else if song.liked === false}
          <button class="like-button" on:click={() => setLike(true)}
            >Like</button
          >
          <button
            data-tooltip="Click to remove dislike"
            class="dislike-button"
            on:click={() => setLike(false)}>Disliked!</button
          >
        {:else}
          <button class="like-button" on:click={() => setLike(true)}
            >Like</button
          >
          <button class="dislike-button" on:click={() => setLike(false)}
            >Dislike</button
          >
        {/if}
      </article>
    </div>
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
  .likes-container {
    display: flex;
    flex-direction: column;
    row-gap: 0;
    padding: 0;
  }
  .likes {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
  }
  .like-button {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    color: blue;
  }
  .dislike-button {
    border-radius: 0 0 0.5rem 0.5rem;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    color: red;
  }
  .like-button:hover {
    color: white;
    background-color: rgba(0, 100, 222, 0.6);
  }
  .dislike-button:hover {
    color: white;
    background-color: rgba(199, 0, 0, 0.6);
  }
</style>
