<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Login from "./login.svelte";
  import House from "svelte-bootstrap-icons/lib/House.svelte";
  import Globe from "svelte-bootstrap-icons/lib/Globe.svelte";

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
  <a on:click={closeMenu} class="link" href="/"><House class="icon" />Home </a>
  <a on:click={closeMenu} class="link" href="/discover">
    <Globe class="icon" /> Discover
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

    background-color: #261e1e;
    color: #ddd;
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
  .link:hover {
    background-color: #856bdc;
    box-shadow: 0px 0px 0.5rem #856bdc;
  }
  .link:focus {
    background-color: #856bdc;
    box-shadow: 0px 0px 0.5rem #856bdc;
  }
  .login-wrapper {
    margin-top: auto;
    position: relative;
  }
</style>
