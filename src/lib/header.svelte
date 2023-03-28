<script>
  import {
    Icon,
    UserCircle,
    MagnifyingGlass,
    Star,
    CircleStack,
  } from "svelte-hero-icons";

  import ThemeSwitch from "./themeSwitch.svelte";
  import { theme } from "./stores";
</script>

<header class="layout-header-{$theme}">
  <a class="styled-link" href="/account"
    ><Icon class="icon" src={UserCircle} />Your Profile</a
  >
  <a class="styled-link" href="/discover"
    ><Icon class="icon" src={MagnifyingGlass} />Find Music</a
  >
  <a class="styled-link" href="/account/music"
    ><Icon class="icon" src={CircleStack} />Your Music</a
  >
  <a class="styled-link" href="/account/saved"
    ><Icon class="icon" src={Star} />Saved Music</a
  >
  <div style="margin-top: auto;">
    <ThemeSwitch />
  </div>
</header>

<style>
  .layout-header-light {
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    height: 100vh;
    background-color: rgba(210, 210, 210, 1);
    color: #000;
    font-size: 1rem;
    font-weight: 600;
    align-items: left;
    padding: 10px;
    display: flex;
    flex-direction: column;
  }
  .layout-header-dark {
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    height: 100vh;
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

  @media only screen and (min-width: 320px) and (max-width: 768px) {
    .layout-header-light {
      font-size: 0.75rem;
    }
    .layout-header-dark {
      font-size: 0.75rem;
    }
  }
</style>
