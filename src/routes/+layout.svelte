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

  let { supabase, session, url } = data;
  $: ({ supabase, session, url } = data);

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
  <Menu />
  <div class="layout-grid">
    <div class="desktop-header">
      <Header open={false} />
    </div>
    <div class="main">
      <PageTransition key={data.url} duration={600}>
        <main class="slot-wrapper">
          <slot />
        </main>
      </PageTransition>
    </div>
    <!-- <div class="sidebar-wrapper">
      <Sidebar />
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
  @media only screen and (min-width: 1024px) {
    .layout-grid {
      grid-template-columns: 250px 1fr;
    }
    .desktop-header {
      display: block;
    }
  }
</style>
