<script lang="ts">
  import AvatarIcon from "$lib/AvatarIcon.svelte";
  import Playbutton from "$lib/Playbutton.svelte";
  import Queuebutton from "$lib/Queuebutton.svelte";
  import Savebutton from "$lib/Savebutton.svelte";
  type SongRow = {
    artist: string | null;
    created_at: string | null;
    id: number;
    name: string | null;
    song_url: string | null;
    profiles: {
      avatar_url: string;
    };
  };
  export let song: SongRow | any;
</script>

<div class="song-card">
  <div class="song-card-container">
    <div class="buttons">
      <Playbutton songUrl={song.song_url ?? ""} />
      <Queuebutton songUrl={song.song_url ?? ""} />
      <Savebutton songUrl={song.song_url ?? ""} songId={song.id ?? ""} />
    </div>
    <div class="song-info">
      <a
        style="white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 25ch;
     "
        class="styled-link"
        href="/songs/{song.name}"
      >
        {song.name}
      </a>
      <a class="profile-link" href="/profiles/{song.artist}">
        <AvatarIcon size={2} url={song.profiles.avatar_url} />

        <p style="color: #333;">
          {song.artist}
        </p>
      </a>
    </div>
  </div>
</div>

<style>
  .song-card {
    background-color: #9898ac;
    box-shadow: 0px 0px 8px #856bdc;
    border-radius: 0.5rem;
    padding: 1rem 1rem;
    color: #1a1a26;
  }
  .song-card-container {
    display: flex;
    flex-direction: column;
    row-gap: 2rem;
    align-items: center;
  }
  .song-info {
    display: flex;
    flex-direction: column;
    row-gap: 6px;
    width: 100%;
    max-width: 350px;
  }
  .profile-link {
    display: flex;
    width: fit-content;
    flex-direction: row;
    align-items: center;
    column-gap: 12px;
    border: none;
    background: none;
    color: inherit;
    text-decoration: none;
    cursor: pointer;
    border-radius: 0.75rem;
    transition: all 0.3s ease;
  }
  .profile-link:hover {
    color: #856bdc;
    text-decoration: underline;
  }
  .buttons {
    display: flex;
    flex-direction: row;
    column-gap: 0.25rem;
  }
  @media only screen and (min-width: 768px) {
    .buttons {
      column-gap: 0.5rem;
    }
    .song-card-container {
      flex-direction: row;
      column-gap: 2rem;
    }
  }
  @media only screen and (min-width: 1024px) {
    .buttons {
      column-gap: 1rem;
    }
  }
</style>
