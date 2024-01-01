<script lang="ts">
  import Playbutton from "$lib/playbutton.svelte";
  import Queuebutton from "$lib/queuebutton.svelte";
  import Savebutton from "$lib/savebutton.svelte";
  import { Icon, MusicalNote, RectangleStack, User } from "svelte-hero-icons";
  type Song = {
    album_id: string;
    artist_id: string | null;
    created_at: string | null;
    description: string | null;
    id: string;
    lyrics: string | null;
    name: string | null;
    song_url: string | null;
  };
  export let song: Song;
</script>

<div class="song-card-container">
  <article class="song-links">
    <a class="song-profile-link" href="/songs/{song.id}">
      <Icon src={MusicalNote} size={"1.5em"} />
      <p class="text-ellipsis">
        {song.name}
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
    gap: 1rem;
    align-items: center;
  }
  .song-links {
    display: flex;
    flex-direction: column;
    gap: 0;
    font-size: 1.25rem;
  }
  .song-profile-link {
    display: flex;
    width: fit-content;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
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
    gap: 0.25rem;
  }
  @media only screen and (min-width: 768px) {
    .song-buttons {
      gap: 0.5rem;
    }
  }
</style>
