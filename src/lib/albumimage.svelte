<script lang="ts">
  import type { SupabaseClient } from "@supabase/supabase-js";
  import { Icon, UserCircle } from "svelte-hero-icons";
  import { onMount, tick } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { page } from "$app/stores";

  export let url: string;
  export let size: number;
  export let altText: string;

  let supabase: SupabaseClient;
  let imageUrl: string | null = null;

  let loadingImage: boolean;
  const downloadImage = async (path: string) => {
    loadingImage = true;

    await tick();
    try {
      const { data, error } = await supabase.storage
        .from("album-images")
        .download(path);

      if (error) {
        throw error;
      }

      const url = URL.createObjectURL(data);
      imageUrl = url;
      loadingImage = false;
    } catch (error) {
      // todo - handle error with
      loadingImage = false;
    }
  };
  $: if (url) downloadImage(url);
  onMount(() => {
    page.subscribe((params) => {
      supabase = params.data.supabase;
    });
  });
</script>

<div class="row-container">
  {#if !loadingImage && imageUrl}
    <img
      referrerpolicy="no-referrer"
      in:fly
      out:fade
      src={imageUrl}
      alt={altText}
      style="box-shadow: 0 2px 8px #856bdc; width: {size}em; height: {size}em; "
    />
  {:else}
    <div
      style=" border-radius: 50%; display: flex; flex-direction: row; align-items:center; justify-content: center;  height: {size}em; width: {size}em"
    >
      <Icon src={UserCircle} size="{size.toString()}em" />
    </div>
  {/if}
</div>
