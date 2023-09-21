<!-- src/routes/account/Avatar.svelte -->
<script lang="ts">
  import AvatarIcon from "$lib/AvatarIcon.svelte";
  import type { SupabaseClient } from "@supabase/supabase-js";
  import { createEventDispatcher } from "svelte";

  export let size = 10;
  export let url: string;
  export let supabase: SupabaseClient;

  let uploading = false;
  let files: FileList;
  const dispatch = createEventDispatcher();

  const uploadAvatar = async () => {
    try {
      uploading = true;

      if (!files || files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = files[0];
      const fileExt = file.name.split(".").pop();
      url = `${Math.random()}.${fileExt}`;

      let { error } = await supabase.storage.from("avatars").upload(url, file);

      if (error) {
        throw error;
      }

      dispatch("upload");
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      uploading = false;
    }
  };
</script>

<div
  style="display: flex; flex-direction: column; row-gap: 12px; align-items: center; "
>
  {#if url}
    <AvatarIcon altText="Your Avatar" size={10} bind:url />
  {:else}
    <div
      class="avatar no-image"
      style="height: {size}em; width: auto; display: flex; align-items: center;"
    >
      You have no avatar yet.
      <br />
      Why not upload one!?
    </div>
  {/if}
  <input type="hidden" name="avatarUrl" value={url} />

  <div style="width: {size}em;">
    <label class="styled-button" for="single">
      {uploading ? "Uploading ..." : "Upload Avatar"}
    </label>
    <input
      style="visibility: hidden; position:absolute;"
      type="file"
      id="single"
      accept="image/*"
      bind:files
      on:change={uploadAvatar}
      disabled={uploading}
    />
  </div>
</div>
