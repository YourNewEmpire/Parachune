<script lang="ts">
  import ThemeSwitch from "./themeSwitch.svelte";
  import { theme } from "./stores";
  import { createEventDispatcher } from "svelte";
  import {
    Icon,
    UserCircle,
    MagnifyingGlass,
    Star,
    CircleStack,
    Home,
  } from "svelte-hero-icons";

  const dispatch = createEventDispatcher();
  export let open: boolean;
  function closeMenu() {
    if (open) {
      dispatch("closemenu", {
        menu: false,
      });
    }
  }
</script>

<nav class="layout-nav-{$theme}">
  <a on:click={closeMenu} class="styled-link" href="/"
    ><Icon class="icon" src={Home} />Home
  </a>
  <a on:click={closeMenu} class="styled-link" href="/account"
    ><Icon class="icon" src={UserCircle} />Your Profile
  </a>
  <a on:click={closeMenu} class="styled-link" href="/discover"
    ><Icon class="icon" src={MagnifyingGlass} />Find Music
  </a>
  <a on:click={closeMenu} class="styled-link" href="/account/music"
    ><Icon class="icon" src={CircleStack} />Your Music
  </a>
  <a on:click={closeMenu} class="styled-link" href="/account/saved"
    ><Icon class="icon" src={Star} />Saved Music</a
  >
  <!-- Perhaps causing the laggy 100vh  -->
  <div style="margin-top: auto;">
    <ThemeSwitch />
  </div>
</nav>

<style>
  .layout-nav-light {
    position: fixed;
    width: 250px;
    top: 0;
    bottom: 0;
    left: 0;
    min-height: 100svh;
    background-color: rgba(210, 210, 210, 1);
    color: #000;
    font-size: 1rem;
    font-weight: 600;
    align-items: left;
    padding: 10px;
    display: flex;
    flex-direction: column;
  }
  .layout-nav-dark {
    position: fixed;
    width: 250px;
    top: 0;
    bottom: 0px;
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
  .styled-link {
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
  .styled-link:hover {
    background-color: #856bdc;
    box-shadow: 0px 0px 8px #856bdc;
  }
</style>
