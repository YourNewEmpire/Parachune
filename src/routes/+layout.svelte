<script lang="ts">
  import { invalidate } from "$app/navigation";
  import { onMount } from "svelte";
  import type { LayoutData } from "./$types";
  import Header from "$lib/header.svelte";
  import { theme } from "$lib/stores";
  import { Icon, ArrowRightCircle } from "svelte-hero-icons";
  import { fade, fly } from "svelte/transition";
  export let data: LayoutData;
  $: ({ supabase } = data);
  let menuVisible = false;
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
    <div class="menu-btn">
      <button
        on:click={() => {
          menuVisible = !menuVisible;
        }}
      >
        <Icon src={ArrowRightCircle} />
      </button>
    </div>
    {#if menuVisible}
      <div
        in:fly={{ x: -300, duration: 500 }}
        class="menu-wrapper"
        style="display: block; width: 250px; position:fixed"
      >
        <Header />
      </div>
      <div
        in:fly={{ x: -400, duration: 500 }}
        style="display: block; width: 75px; position:fixed; top: 10; right: 50;"
      >
        <button
          on:click={() => {
            menuVisible = !menuVisible;
          }}
        >
          <Icon src={ArrowRightCircle} />
        </button>
      </div>
    {/if}
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
    grid-template-rows: 1fr;

    grid-column-gap: 0px;
    grid-row-gap: 0px;
  }
  .header-wrapper {
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
  @supports (-webkit-touch-callout: none) {
    .layout-grid {
      min-height: -webkit-fill-available;
    }
  }
  @media only screen and (min-width: 1024px) {
    .layout-grid {
      grid-template-columns: 250px 1fr;
    }
    .header-wrapper {
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
