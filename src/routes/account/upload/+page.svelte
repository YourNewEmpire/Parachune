<script lang="ts">
  import { enhance } from "$app/forms";
  import { addToast } from "$lib/stores";
  import type { PageData, SubmitFunction } from "./$types";
  export let data: PageData;

  let { albumData } = data;

  let loading = false;
  let uploadFormMsg: string;
  let albumFormMsg: string;

  // Submit Handler

  const handleSubmit: SubmitFunction = () => {
    loading = true;
    return async ({ result, update }) => {
      if (result.type === "success") {
        //@ts-ignore
        if (result.data.newAlbum) {
          //@ts-ignore
          albumData = [...albumData, result.data.newAlbum];
        }
        addToast({
          dismissable: true,
          message: result.data?.message ?? "Action complete",
          timeout: 5000,
          type: "success",
        });
        update();
        return;
      } else {
        addToast({
          dismissable: true,
          message:
            "Failed upload, check you have filled the form and not exceeded file size limits. Contact support if there is a clear issue.",
          timeout: 5000,
          type: "failure",
        });
      }
      loading = false;
    };
  };

  // INPUT HANDLERS

  function handleFileInput(e: any) {
    if (e.target.files[0].size > 50000000) {
      addToast({
        type: "warning",
        dismissable: true,
        message: "File exceeds the current 50MB limit. Uploading it will fail.",
        timeout: 5000,
      });
    }
  }
</script>

<section>
  <h1>Upload a song or create an album</h1>
  <div style="display: flex; justify-content: center; gap: 1rem;">
    <form
      enctype="multipart/form-data"
      class="input-group card"
      method="post"
      action="?/uploadSong"
      use:enhance={handleSubmit}
    >
      <div class="input-item">
        <label for="songName">Song Name</label>
        <input type="text" name="songName" id="" />
      </div>

      <div class="input-item">
        <label for="song">Song File (under 50MB)</label>
        <input on:change={handleFileInput} type="file" name="song" />
      </div>

      <div class="input-item">
        <label for="songAlbum">Song Album</label>
        <select
          name="songAlbum"
          id="songAlbum"
          disabled={albumData?.length ?? [].length > 1 ? false : true}
        >
          {#each albumData ?? [] as a}
            <option value={a.id}>{a.title}</option>
          {/each}
          <!-- todo - MAP OVER ALBUMS FROM DATA AND RENDER -->
        </select>
      </div>
      <button
        class="styled-button"
        style="font-family: Sono, sans-serif; margin-top: auto;"
        disabled={loading}
        type="submit"
      >
        Upload
      </button>
    </form>

    <form
      class="input-group card"
      enctype="multipart/form-data"
      method="post"
      action="?/createAlbum"
      use:enhance={handleSubmit}
    >
      <div class="input-item">
        <label for="albumName">Album Name</label>
        <input type="text" name="albumName" />
      </div>
      <div class="input-item">
        <label for="albumImage">Album Image (under 50MB)</label>
        <input on:change={handleFileInput} type="file" name="albumImage" />
      </div>
      <div class="input-item">
        <label for="albumGenre">Album Genre (Optional)</label>
        <input type="text" name="albumGenre" />
      </div>
      <div class="upload-radio">
        <article>
          <input type="radio" name="albumType" id="typeAlbum" value="album" />
          <label for="typeAlbum">Album</label>
        </article>
        <article>
          <input type="radio" name="albumType" id="typeSingle" value="single" />
          <label for="typeSingle">Single</label>
        </article>
      </div>

      <button
        class="styled-button"
        style="font-family: Sono, sans-serif; margin-top: auto;"
        disabled={loading}
        type="submit">Upload</button
      >
    </form>
  </div>
</section>

<style>
  .upload-radio {
    color: var(--text-secondary-color);
    display: grid;
    grid-template-columns: 50% 50%;
  }
  .upload-radio article {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .upload-radio label {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    padding: 0.5em 0.5em;
    font-size: 1.5em;
    cursor: pointer;
    transition: all 0.1s ease;
    border-radius: 0.5em;
    transform: scale(1);
  }
  .upload-radio input[type="radio"] {
    visibility: hidden;
    display: none;
  }
  .upload-radio label:hover {
    background-color: var(--primary-color);
    box-shadow: 0 0 8px var(--primary-color);
  }
  .upload-radio input[type="radio"]:checked + label {
    transition: all 0.3s ease;
    border-radius: 2em;
    transform: scale(0.8);
    background-color: var(--primary-color);
    box-shadow: 0 0 8px var(--primary-color);
  }
</style>
