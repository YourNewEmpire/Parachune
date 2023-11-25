<script lang="ts">
  import Header from "$lib/Header/Header.svelte";
  import { Icon, Bars3 } from "svelte-hero-icons";
  import { fly } from "svelte/transition";
  import clickOutside from "$lib/utils/clickOutside";
  import type { SupabaseClient } from "@supabase/supabase-js";
  export let supabase: SupabaseClient;
  export let profile: App.PageData["profile"];
  export let session: App.PageData["session"];
  let menuVisible = false;
  function handleClose() {
    menuVisible = false;
  }
</script>

<header
  style="z-index: 20; display:block; opacity: 1;"
  use:clickOutside={{ enabled: menuVisible, cb: () => (menuVisible = false) }}
>
  <div class="open-menu-btn">
    <button
      on:click={() => {
        menuVisible = !menuVisible;
      }}
    >
      <Icon src={Bars3} />
    </button>
  </div>
  {#if menuVisible}
    <div transition:fly={{ x: -300, duration: 200 }} class="header-wrapper">
      <Header
        {supabase}
        {session}
        {profile}
        on:closemenu={handleClose}
        open={menuVisible}
      />
    </div>
    <div transition:fly={{ x: -300, duration: 200 }} class="close-menu-btn">
      <button
        on:click={() => {
          menuVisible = false;
        }}
      >
        <Icon src={Bars3} />
      </button>
    </div>
  {/if}
</header>

<style>
  button {
    border-radius: 50%;
    color: #856bdc;
  }

  .open-menu-btn {
    display: flex;
    align-items: center;
    position: fixed;
    height: 60px;
    width: 60px;
  }
  .close-menu-btn {
    background-color: rgba(133, 107, 220, 0.5);
    border-radius: 0px 100px 100px 0px;
    display: flex;
    align-items: center;
    position: fixed;
    height: 60px;
    width: 60px;
    margin-left: 250px;
  }
  .header-wrapper {
    display: none;
    z-index: 21;
    display: block;
    width: 250px;
    position: fixed;
  }
  @media only screen and (min-width: 1024px) {
    .header-wrapper {
      display: none;
    }
    .open-menu-btn {
      display: none;
    }
    .close-menu-btn {
      display: none;
    }
  }
</style>
