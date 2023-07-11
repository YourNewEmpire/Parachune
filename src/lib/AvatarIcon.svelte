<script lang="ts">
  import type { SupabaseClient } from "@supabase/supabase-js";
  import { Icon, UserCircle } from "svelte-hero-icons";
  import { tick } from "svelte";
  import { fade, fly } from "svelte/transition";

  export let url: string;
  export let size: number;
  export let supabase: SupabaseClient;
  let avatarUrl: string | null = null;
  let loadingImage: boolean;
  const downloadImage = async (path: string) => {
    loadingImage = true;
    console.log("Url changed, download image.");
    await tick();
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);

      if (error) {
        throw error;
      }

      const url = URL.createObjectURL(data);
      avatarUrl = url;
      loadingImage = false;
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error downloading image: ", error.message);
      }
      loadingImage = false;
    }
  };
  $: if (url) downloadImage(url);
</script>

<div class="row-container">
  {#if !loadingImage}
    <img
      in:fly
      out:fade
      src={avatarUrl}
      alt=""
      style="width: {size}em; height: {size}em; border-radius: 50%;"
    />
  {:else}
    <div
      style="position: absolute; display: flex; flex-direction: row;  height: {size}em; width: {size}em"
      in:fade
      out:fade
    >
      <p>Loading avatar ...</p>
      <Icon src={UserCircle} size="{size.toString()}em" />
    </div>
  {/if}
</div>
