<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { onMount } from "svelte";
  import Login from "./login.svelte";
  import House from "svelte-bootstrap-icons/lib/House.svelte";
  import Globe from "svelte-bootstrap-icons/lib/Globe.svelte";
  import CardChecklist from "svelte-bootstrap-icons/lib/CardChecklist.svelte";
  import InfoCircle from "svelte-bootstrap-icons/lib/InfoCircle.svelte";
  import Moon from "svelte-bootstrap-icons/lib/Moon.svelte";
  import Sun from "svelte-bootstrap-icons/lib/Sun.svelte";
  import type { SupabaseClient } from "@supabase/supabase-js";
  import type { Database } from "../../../types/DbDefinitions";

  const dispatch = createEventDispatcher();

  export let open: boolean;
  export let supabase: SupabaseClient;
  export let profile: Database["public"]["Tables"]["profiles"]["Row"] | null;
  export let session: App.PageData["session"];
  function closeMenu() {
    if (open) {
      dispatch("closemenu");
    }
  }

  let currentTheme = "";

  onMount(() => {
    const savedTheme = document.documentElement.getAttribute("data-theme");
    //? Manual theme
    if (savedTheme) {
      currentTheme = savedTheme;
      return;
    }
    //? Not manual theme, get prefers-color-scheme

    const preferDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const theme = preferDark ? "dark" : "light";
    setTheme(theme);
  });

  const setTheme = (theme: "dark" | "light") => {
    const one_year = 60 * 60 * 24 * 365;
    document.cookie = `siteTheme=${theme}; max-age=${one_year}; path=/`;
    document.documentElement.setAttribute("data-theme", theme);
    currentTheme = theme;
  };
</script>

<nav class="layout-nav">
  <a on:click={closeMenu} class="link" href="/"><House class="icon" />Home </a>
  <a on:click={closeMenu} class="link" href="/discover">
    <Globe class="icon" /> Discover
  </a>
  <a on:click={closeMenu} class="link" href="/updates">
    <CardChecklist class="icon" /> Updates
  </a>
  <a on:click={closeMenu} class="link" href="/about">
    <InfoCircle class="icon" /> About Parachune
  </a>
  <article class="login-wrapper">
    <Login {supabase} {profile} {session} />
  </article>
  {#if currentTheme === "light"}
    <button
      on:click|stopPropagation={() => setTheme("dark")}
      class="bs-icon-button"
      ><Moon class="bs-icon" />
    </button>
  {:else}
    <button
      on:click|stopPropagation={() => setTheme("light")}
      class="bs-icon-button"
    >
      <Sun class="bs-icon" />
    </button>
  {/if}
</nav>

<style>
  .layout-nav {
    font-family: "Sono", sans-serif;
    position: fixed;
    width: 250px;
    top: 0;
    bottom: 0;
    left: 0;
    min-height: 100svh;
    background-color: var(--fg-color);
    color: var(--text-color);
    font-weight: 600;
    padding: 0.5rem;
    /* padding: 0.625rem; */
    display: flex;
    flex-direction: column;
  }
  .link {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    color: inherit;
    text-decoration: none;
    align-items: center;
    padding: 0.5rem 0.5rem;
    border-radius: 0.5rem;
    transition: all 0.3s ease;
  }
  .link:hover,
  .link:focus {
    color: var(--text-secondary-color);
    background-color: var(--text-color);
    box-shadow: 0px 0px 0.5rem var(--accent-color);
    outline: none;
  }

  .login-wrapper {
    margin-top: auto;
    position: relative;
  }
</style>
