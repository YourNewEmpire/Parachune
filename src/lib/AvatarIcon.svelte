<script lang="ts">
  import type { SupabaseClient } from "@supabase/supabase-js";
  import { Icon, UserCircle } from "svelte-hero-icons";
  import { tick } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { page } from "$app/stores";
  export let url: string;
  export let size: number;
  export let altText: string;
  let supabase: SupabaseClient;
  let avatarUrl: string | null = null;

  let loadingImage: boolean;
  const downloadImage = async (path: string) => {
    loadingImage = true;
    //? if image path is a full url (not supabase object name) then just set it.
    // this is because of users signing up with google and a profile image on google acc.
    if (path.startsWith("http")) {
      avatarUrl = path;
      loadingImage = false;
      return;
    }
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

  page.subscribe((params) => {
    supabase = params.data.supabase;
  });
</script>

<div class="row-container">
  {#if !loadingImage}
    <img
      in:fly
      out:fade
      src={avatarUrl}
      alt={altText}
      style="box-shadow: 0 2px 8px #856bdc; width: {size}em; height: {size}em; border-radius: 50%;"
    />
  {:else}
    <div
      style=" display: flex; flex-direction: row; align-items:center; justify-content: center;  height: {size}em; width: {size}em"
      in:fade
      out:fade
    >
      <p>Loading avatar ...</p>
      <Icon src={UserCircle} size="{size.toString()}em" />
    </div>
  {/if}
</div>
