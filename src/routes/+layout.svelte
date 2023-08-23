<script lang="ts">
  import "../styles/app.css";
  import { invalidate } from "$app/navigation";
  import { onMount } from "svelte";
  import type { LayoutData } from "./$types";
  import Header from "$lib/Header.svelte";
  import Player from "$lib/Player.svelte";
  import Menu from "$lib/Menu.svelte";
  import ToastsParent from "$lib/Toastsparent.svelte";
  import PageTransition from "$lib/Transition.svelte";

  export let data: LayoutData;

  let { supabase, session, url, profile } = data;
  $: ({ supabase, session, url, profile } = data);

  onMount(() => {
    const { data } = supabase.auth.onAuthStateChange((event, _session) => {
      if (_session?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth");
      }
    });

    return () => data.subscription.unsubscribe();
  });
</script>

<div>
  <ToastsParent />
  <Menu {profile} />
  <div class="layout-grid">
    <header class="desktop-header">
      <Header {profile} open={false} />
    </header>
    <main class="main">
      <PageTransition key={data.url} duration={600}>
        <section class="slot-wrapper">
          <slot />
        </section>
      </PageTransition>
    </main>
    <!-- <div class="sidebar-wrapper">
      <div class="sidebar" />
    </div> -->
  </div>
  <Player sClient={supabase} />
</div>

<style>
  .main {
    background-color: #000;
    color: #fff;
    min-height: 100vh;
  }

  .layout-grid {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    grid-column-gap: 0px;
    grid-row-gap: 0px;
  }

  .slot-wrapper {
    margin: 4rem 2rem;
  }

  .desktop-header {
    display: none;
  }
  /* .sidebar-wrapper {
    display: none;
  }
  .sidebar {
    position: fixed;
    width: 250px;
    top: 0;
    bottom: 0;
    right: 0;
    min-height: 100svh;
    background-color: rgba(38, 30, 30, 1);
    color: #ddd;
    font-size: 1rem;
    font-weight: 600;
    align-items: left;
    padding: 10px;
    display: flex;
    flex-direction: column;
  } */

  @media only screen and (min-width: 1024px) {
    .slot-wrapper {
      margin: 4rem 4rem;
    }
    .layout-grid {
      grid-template-columns: 250px 1fr;
    }
    .desktop-header {
      display: block;
    }
    /* .sidebar-wrapper {
      display: block;
    } */
  }
</style>
