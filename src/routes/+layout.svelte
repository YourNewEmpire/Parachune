<script lang="ts">
  import { invalidate } from "$app/navigation";
  import { onMount } from "svelte";
  import type { LayoutData } from "./$types";
  import Header from "$lib/header.svelte";
  import { theme } from "$lib/stores";
  import Player from "$lib/player.svelte";
  import Menu from "$lib/menu.svelte";
  export let data: LayoutData;
  $: ({ supabase } = data);
  onMount(() => {
    const { data } = supabase.auth.onAuthStateChange(() => {
      invalidate("supabase:auth");
    });

    return () => data.subscription.unsubscribe();
  });
</script>

<svelte:head>
  <title>Connected Music</title>
</svelte:head>
<div>
  <Menu />
  <div class="layout-grid">
    <div class="desktop-header">
      <Header open={false} />
    </div>
    <Player />
    <div class="main-{$theme}">
      <div class="slot-wrapper">
        <slot />
      </div>
    </div>
    <!-- <div class="sidebar-wrapper">
      <Sidebar />
    </div> -->
  </div>
</div>

<style>
  .main-light {
    background-color: #fff;
    color: #000;
    min-height: 100vh;
  }
  .main-dark {
    background-color: #000;
    color: #fff;
    min-height: 100vh;
  }
  .slot-wrapper {
    margin: 4rem 4rem;
  }
  .layout-grid {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    grid-column-gap: 0px;
    grid-row-gap: 0px;
  }
  .desktop-header {
    display: none;
  }
  .menu-btn {
    color: #856bdc;
    display: block;
    position: fixed;
    height: 60px;
    width: 60px;
  }
  .menu-wrapper {
    display: none;
  }

  @media only screen and (min-width: 1024px) {
    .layout-grid {
      grid-template-columns: 250px 1fr;
    }
    .desktop-header {
      display: block;
    }
    .menu-btn {
      display: none;
    }
  }
  /* @media only screen and (min-width: 1440px) {
    .layout-grid {
      grid-template-columns: 2fr 12fr;
    }
  }
  @media only screen and (min-width: 2160px) {
    .layout-grid {
      grid-template-columns: 1fr 8fr;
    }
  } */
</style>
