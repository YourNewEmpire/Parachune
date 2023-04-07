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

<div>
  <h1>Upload a song</h1>
  <form
    class="input-group"
    method="post"
    action="?/uploadSong"
    use:enhance={handleSubmit}
    bind:this={uploadForm}
  >
    <label for="songName">Song Name</label>
    <input on:input={handleInput} type="text" name="songName" id="" />
    <label for="song">Song Name</label>
    <input type="file" name="song" />
    <button
      class="styled-button"
      style="font-family: Sono, sans-serif;"
      disabled={loading}
      type="submit">Upload</button
    >
  </form>
  <p>{formMessage}</p>
  <h1>Songs for {profile?.username ?? session?.user.email}</h1>
  {#if !profile?.username}
    <a href="/account">Update username</a>
  {/if}
</div>
