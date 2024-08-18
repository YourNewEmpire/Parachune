<script lang="ts">
  import Playbutton from "$lib/ui/playbutton.svelte";
  import Queuebutton from "$lib/ui/queuebutton.svelte";
  import Savebutton from "$lib/ui/savebutton.svelte";
  import { Icon, MusicalNote } from "svelte-hero-icons";

  type Song = {
    album_id: string;
    artist_id: string | null;
    created_at: string | null;
    description: string | null;
    id: string;
    lyrics: string | null;
    name: string | null;
    song_url: string | null;
    profiles: {
      username: string | null;
    } | null;
  };

  export let song: Song;
  export let unSave: boolean = false;
  let songPlayerData = {
    artistId: song.artist_id ?? "",
    artistName: song.profiles?.username ?? "",
    id: song.id,
    name: song.name ?? "",
    songUrl: song.song_url ?? "",
  };
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
    <Playbutton songData={songPlayerData} />
    <Queuebutton songData={songPlayerData} />
    <Savebutton {unSave} songUrl={song.song_url ?? ""} songId={song.id ?? ""} />
  </article>
</div>

<style>
  .song-card-container {
    background-color: var(--fg-color);
    box-shadow: 0px 0px 0.5rem var(--primary-color);
    border-radius: 0.5rem;
    padding: 1rem 1rem;
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
    color: inherit;
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
