<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import {
    Icon,
    UserCircle,
    MagnifyingGlass,
    Star,
    CircleStack,
    Home,
    Cog6Tooth,
  } from "svelte-hero-icons";
  const dispatch = createEventDispatcher();
  export let open: boolean;
  export let profile: App.PageData["profile"];
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
  {#if profile}
    <a on:click={closeMenu} class="link" href="/account"
      ><Icon class="icon" src={Cog6Tooth} />My Account
    </a>
    <a on:click={closeMenu} class="link" href="/profiles/{profile.username}"
      ><Icon class="icon" src={UserCircle} />My Public Profile
    </a>
    <a on:click={closeMenu} class="link" href="/account/music"
      ><Icon class="icon" src={CircleStack} />My Music
    </a>
    <a on:click={closeMenu} class="link" href="/account/saved"
      ><Icon class="icon" src={Star} />My Saved Music
    </a>
  {:else}
    <a on:click={closeMenu} class="link" href="/login"
      ><Icon class="icon" src={UserCircle} />Login / Signup
    </a>
  {/if}
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
    font-size: 1rem;
    font-weight: 600;
    align-items: left;
    padding: 10px;
    display: flex;
    flex-direction: column;
  }
  .link {
    display: flex;
    flex-direction: row;
    column-gap: 6px;
    align-items: center;
    color: inherit;
    text-decoration: none;
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
</style>
