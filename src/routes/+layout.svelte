<script lang="ts">
  import Header from "$lib/header.svelte";
  import { theme } from "$lib/stores";
  import { invalidate } from "$app/navigation";
  import { onMount } from "svelte";
  import type { LayoutData } from "./$types";

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
  <div class="layout-grid">
    <div class="header-wrapper">
      <Header />
    </div>
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
  }
  .main-dark {
    background-color: #000;
    color: #fff;
  }
  .slot-wrapper {
    margin: 4rem 4rem;
    min-height: 100vh;
  }
  .layout-grid {
    display: grid;
    grid-template-columns: 1fr;
  }
  .header-wrapper {
    display: none;
  }
  @supports (-webkit-touch-callout: none) {
    .layout-grid {
      min-height: -webkit-fill-available;
    }
  }
  @media only screen and (min-width: 1024px) {
    .layout-grid {
      grid-template-columns: 2fr 8fr;
    }
    .header-wrapper {
      display: block;
    }
  }
  @media only screen and (min-width: 1440px) {
    .layout-grid {
      grid-template-columns: 2fr 12fr;
    }
  }
  @media only screen and (min-width: 2160px) {
    .layout-grid {
      grid-template-columns: 1fr 8fr;
    }
  }
</style>
