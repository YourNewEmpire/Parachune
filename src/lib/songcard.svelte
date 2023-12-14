<script lang="ts">
  import AvatarIcon from "$lib/avataricon.svelte";
  import Playbutton from "$lib/playbutton.svelte";
  import Queuebutton from "$lib/queuebutton.svelte";
  import Savebutton from "$lib/savebutton.svelte";
  type SongRow = {
    artist_id: number;
    created_at: string | null;
    id: number;
    name: string | null;
    song_url: string | null;
    profiles: {
      id: string;
      avatar_url: string;
      username: string;
    };
  };
  export let song: SongRow | any;
</script>

<div class="song-card-container">
  <article class="song-links">
    <a
      style="width: fit-content;"
      class="text-ellipsis styled-link"
      href="/songs/{song.id}"
    >
      {song.name}
    </a>
    <a class="song-profile-link" href="/profiles/{song.artist_id}">
      <AvatarIcon
        altText={song.profiles.username}
        size={2}
        url={song.profiles.avatar_url}
      />

      <p class="text-ellipsis">
        {song.profiles.username}
      </p>
    </a>
  </article>
  <article class="song-buttons">
    <Playbutton songUrl={song.song_url ?? ""} />
    <Queuebutton songUrl={song.song_url ?? ""} />
    <Savebutton songUrl={song.song_url ?? ""} songId={song.id ?? ""} />
  </article>
</div>

<style>
  .song-card-container {
    background-color: #9898ac;
    box-shadow: 0px 0px 8px #856bdc;
    border-radius: 0.5rem;
    padding: 1rem 1rem;
    color: #1a1a26;
    display: flex;
    flex-direction: column;
    row-gap: 1rem;
    align-items: center;
  }
  .song-links {
    display: flex;
    flex-direction: column;
    row-gap: 6px;
    font-size: 18px;
  }
  .song-profile-link {
    display: flex;
    width: fit-content;
    flex-direction: row;
    align-items: center;
    column-gap: 12px;
    border: none;
    background: none;
    color: #443;
    text-decoration: none;
    cursor: pointer;
    border-radius: 0.75rem;
    transition: all 0.3s ease;
  }
  .song-profile-link:hover {
    color: #856bdc;
    text-decoration: underline;
  }
  .song-buttons {
    display: flex;
    flex-direction: row;
    column-gap: 0.25rem;
  }
  @media only screen and (min-width: 768px) {
    .song-buttons {
      column-gap: 0.5rem;
    }
    .song-card-container {
      flex-direction: column;
      column-gap: 2rem;
    }
  }
  @media only screen and (min-width: 1024px) {
    .song-buttons {
      column-gap: 1rem;
    }
  }
</style>
