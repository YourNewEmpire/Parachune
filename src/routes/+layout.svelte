<script lang="ts">
  import "../styles/app.css";
  import "tippy.js/dist/tippy.css";
  import { invalidate } from "$app/navigation";
  import { onMount } from "svelte";
  import type { LayoutData } from "./$types";
  import Header from "$lib/header/header.svelte";
  import Menu from "$lib/header/menu.svelte";
  import Player from "$lib/player.svelte";
  import ToastsParent from "$lib/toastsparent.svelte";
  import PageTransition from "$lib/transition.svelte";
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
  <Menu {supabase} {session} {profile} />
  <div class="layout-grid">
    <header class="desktop-header">
      <Header {supabase} {session} {profile} open={false} />
    </header>
    <div class="bg"></div>
    <main class="main">
      <PageTransition key={url} duration={600}>
        <section class={url === "/" ? "slot-wrapper-home" : "slot-wrapper"}>
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
  .bg {
    background-color: #856bdc;

    /* BROKEN: mobile has to recompute bg when UI bottom bar moves into view. need an absolute bg. need to add support for all browsers*/
    background-image: linear-gradient(
        140deg,
        rgba(12, 12, 12, 0.9) 70%,
        rgba(12, 12, 12, 0.85) 80%,
        rgba(12, 12, 12, 0.75) 85%,
        rgba(12, 12, 12, 0.65) 90%,

        rgba(0, 0, 0, 0.5)
      ),
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='100%25' height='100%25'%3E%3Cdefs%3E%3Cpattern id='p' width='100' height='100' patternUnits='userSpaceOnUse' patternTransform='rotate(35) scale(0.46)'%3E%3Cpath id='a' data-color='fill' fill='%239898AC' stroke='%239898AC' stroke-width='13.35' d='M-25 20h50L0-20z'%3E%3C/path%3E%3Cuse xlink:href='%23a' x='100'%3E%3C/use%3E%3Cuse xlink:href='%23a' y='100'%3E%3C/use%3E%3Cuse xlink:href='%23a' x='100' y='100'%3E%3C/use%3E%3Cuse xlink:href='%23a' x='50' y='50'%3E%3C/use%3E%3Cuse xlink:href='%23a' x='50' y='150'%3E%3C/use%3E%3C/pattern%3E%3C/defs%3E%3Crect fill='url(%23p)' width='100%25' height='100%25'%3E%3C/rect%3E%3C/svg%3E");

    background-repeat: no-repeat;
    background-position: center;
    height: 100%;
    width: 100%;
    position: fixed;
    /* z-index usage is up to you.. although there is no need of using it because the default stack context will work. */
    z-index: 0;
  }
  .main {
    color: #fff;
    position: relative;
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
  .slot-wrapper-home {
    margin: 0.5rem 1.5rem;
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
    .slot-wrapper-home {
      margin: 0 4rem;
    }
    .layout-grid {
      grid-template-columns: 250px 1fr;
    }
    .desktop-header {
      z-index: 1;
      display: block;
    }
    /* .sidebar-wrapper {
      display: block;
    } */
  }
</style>
