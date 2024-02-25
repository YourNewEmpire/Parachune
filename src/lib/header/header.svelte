<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { onMount } from "svelte";
  import Login from "./login.svelte";
  import House from "svelte-bootstrap-icons/lib/House.svelte";
  import Globe from "svelte-bootstrap-icons/lib/Globe.svelte";
  import Moon from "svelte-bootstrap-icons/lib/Moon.svelte";
  import Sun from "svelte-bootstrap-icons/lib/Sun.svelte";

  import type { SupabaseClient } from "@supabase/supabase-js";
  import type { Database } from "../../types/DbDefinitions";

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
    const preferDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const isManualDark = document.documentElement.dataset.theme === "dark";
    const isManualLight = document.documentElement.dataset.theme === "light";

    if (isManualLight) {
      setTheme("light");
      return;
    }
    if (isManualDark) {
      setTheme("dark");
      return;
    } else {
      console.log("not manual theme");
      setTheme(preferDark ? "dark" : "light");
      return;
    }
  });

  const setTheme = (theme: "dark" | "light") => {
    document.documentElement.dataset.theme = theme;
    document.cookie = `siteTheme=${theme};max-age=31536000;path="/"`;
    currentTheme = theme;
  };
</script>

<nav class="layout-nav">
  <a on:click={closeMenu} class="link" href="/"><House class="icon" />Home </a>
  <a on:click={closeMenu} class="link" href="/discover">
    <Globe class="icon" /> Discover
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
