<script lang="ts">
  import AvatarIcon from "$lib/AvatarIcon.svelte";
  import Playbutton from "$lib/Playbutton.svelte";
  import Queuebutton from "$lib/Queuebutton.svelte";
  import Savebutton from "$lib/Savebutton.svelte";
  import type { SupabaseClient } from "@supabase/supabase-js";
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
  export let song: SongRow;
</script>

<div class="card">
  <div class="row-container">
    <div class="row-container">
      <Playbutton songUrl={song.song_url ?? ""} />
      <Queuebutton songUrl={song.song_url ?? ""} />
      <Savebutton songUrl={song.song_url ?? ""} songId={song.id ?? ""} />
    </div>
    <div class="song-info">
      <p>
        {song.name}
      </p>
      <div class="row-container">
        <AvatarIcon size={5} url={song.profiles.avatar_url} />
        <p>
          {song.artist}
        </p>
      </div>
    </div>
  </div>
</div>

<style>
  .song-info {
    display: flex;
    flex-direction: column;
    row-gap: 6px;
  }
</style>
