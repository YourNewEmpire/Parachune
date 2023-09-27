<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageData } from "./$types";
  export let data: PageData;

  let { session, profile } = data;
  let uploadForm: any;
  let loading = false;
  let formMessage = "";
  function handleSubmit() {
    loading = true;

    return async ({ result }: { result: any }) => {
      uploadForm.reset();
      formMessage = result.data.message;
      loading = false;
    };
  }
  function handleInput(e: any) {
    if (e.target.value < 1) {
      formMessage = "Song name must be at least 1 char";
    } else {
      formMessage = "";
    }
  }
  // onMount(() => {
  //   supabase
  //     .channel("any")
  //     .on(
  //       "postgres_changes",
  //       {
  //         event: "*",
  //         schema: "public",
  //         table: "songs",
  //         filter: `artist=eq.${profile.username}`,
  //       },
  //       (payload) => {
  //         console.log("Change received!", payload);
  //
  //         //@ts-ignore
  //         songs = [...songs, payload.new];
  //       }
  //     )
  //     .subscribe();

  //   return async () => supabase.removeAllChannels();
  // });
</script>

<h1>Upload a song</h1>
<div style="display: flex; justify-content: center; ">
  <section class="card">
    <form
      class="input-group"
      method="post"
      action="?/uploadSong"
      use:enhance={handleSubmit}
      bind:this={uploadForm}
    >
      <div class="input-item">
        <label for="songName">Song Name</label>
        <input on:input={handleInput} type="text" name="songName" id="" />
      </div>
      <div class="input-item">
        <label for="song">Song File</label>
        <input type="file" name="song" />
      </div>
      <button
        class="styled-button"
        style="font-family: Sono, sans-serif;"
        disabled={loading}
        type="submit">Upload</button
      >
    </form>
  </section>
</div>
