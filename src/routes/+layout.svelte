<script lang="ts">
  import "../styles/app.css";
  import "tippy.js/dist/tippy.css";
  import { invalidate } from "$app/navigation";
  import { onMount } from "svelte";
  import type { LayoutData } from "./$types";
  import Header from "$lib/layout/header/header.svelte";
  import Menu from "$lib/layout/header/menu.svelte";
  import Player from "$lib/player.svelte";
  import ToastsParent from "$lib/toastsparent.svelte";
  import PageTransition from "$lib/transition.svelte";
  import { navigating } from "$app/stores";
  import Loadingspinner from "$lib/layout/loadingspinner.svelte";
  import Footer from "$lib/layout/footer/footer.svelte";
  import Svgbackground from "$lib/layout/svgbackground.svelte";
  import { addLinkToast, addToast } from "$lib/stores";
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
  // todo - Create callback and put in other correct params and test
  onMount(() => {
    if (session) {
      supabase
        .channel("comment-inserts")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "song_comments",
            filter: `artist_id=eq.${session?.user.id}`,
          },
          async (payload) => {
            const { data, error } = await supabase
              .from("songs")
              .select(`name`)
              .eq("id", payload.new.song_id)
              .single();
            if (error) {
              addLinkToast({
                link: `/songs/${payload.new.song_id}`,
                message:
                  "Someone commented on your song. Leave current page and check it out?",
                timeout: 10000,
                type: "info",
              });
              return;
            } else {
              addLinkToast({
                link: `/songs/${payload.new.song_id}`,
                message: `Someone commented on ${data.name}. Leave current page and check it out?`,
                timeout: 10000,
                type: "info",
              });
              return;
            }
          }
        )
        .subscribe();
    }
  });
</script>

<div>
  <ToastsParent />
  <Menu {supabase} {session} {profile} />
  <div class="layout-grid">
    <header class="desktop-header">
      <Header {supabase} {session} {profile} open={false} />
    </header>
    <Svgbackground />
    <div class="main-content">
      <Loadingspinner isLoading={$navigating ? true : false} />
      <PageTransition key={url} duration={600}>
        <main class={url === "/" ? "slot-wrapper-home" : "slot-wrapper"}>
          <slot />
        </main>
      </PageTransition>
      <Footer />
    </div>
  </div>
  <Player sClient={supabase} />
</div>

<style>
  .layout-grid {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    grid-column-gap: 0px;
    grid-row-gap: 0px;
  }

  .main-content {
    color: var(--text-color);
    position: relative;
  }

  .slot-wrapper {
    min-height: 100vh;
    margin: 4rem 2rem;
  }

  .slot-wrapper-home {
    min-height: 100vh;
    margin: 0.5rem 1.5rem;
  }

  .desktop-header {
    display: none;
  }

  @media only screen and (min-width: 1024px) {
    .layout-grid {
      grid-template-columns: 250px 1fr;
    }

    .slot-wrapper {
      min-height: 100vh;
      margin: 4rem 4rem;
    }

    .slot-wrapper-home {
      min-height: 100vh;
      margin: 0 4rem;
    }

    .desktop-header {
      z-index: 1;
      display: block;
    }
  }
</style>
