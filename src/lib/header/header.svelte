<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { Icon, MagnifyingGlass, Home } from "svelte-hero-icons";
  import Login from "./login.svelte";
  import type { SupabaseClient } from "@supabase/supabase-js";

  const dispatch = createEventDispatcher();

  export let open: boolean;
  export let supabase: SupabaseClient;
  export let profile: App.PageData["profile"];
  export let session: App.PageData["session"];
  function closeMenu() {
    if (open) {
      dispatch("closemenu");
    }
  }
</script>

<nav class="layout-nav-dark">
  <a on:click={closeMenu} class="link" href="/"
    ><Icon class="icon" src={Home} />Home
  </a>
  <a on:click={closeMenu} class="link" href="/discover"
    ><Icon class="icon" src={MagnifyingGlass} />Discover
  </a>
  <article class="login-wrapper">
    <Login {supabase} {profile} {session} />
  </article>
</nav>

<style>
  .layout-nav-dark {
    font-family: "Sono", sans-serif;
    position: fixed;
    width: 250px;
    top: 0;
    bottom: 0;
    left: 0;
    min-height: 100svh;
    background-color: rgba(38, 30, 30, 1);
    color: #ddd;
    font-weight: 600;
    padding: 10px;
    display: flex;
    flex-direction: column;
  }
  .link {
    display: flex;
    flex-direction: row;
    gap: 0.5em;
    color: inherit;
    text-decoration: none;
    align-items: center;
    padding: 0.5rem 0.5rem;
    border-radius: 0.5rem;
    transition: all 0.3s ease;
  }
  .link:hover {
    background-color: #856bdc;
    box-shadow: 0px 0px 8px #856bdc;
  }
  .link:focus {
    background-color: #856bdc;
    box-shadow: 0px 0px 8px #856bdc;
  }
  .login-wrapper {
    margin-top: auto;
    position: relative;
  }
</style>
