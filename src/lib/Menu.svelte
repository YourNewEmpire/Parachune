<script lang="ts">
  import Header from "$lib/Header.svelte";
  import { Icon, Bars3 } from "svelte-hero-icons";
  import { fly } from "svelte/transition";

  export let profile: any;

  //@ts-ignore
  function clickOutside(node, { enabled: initialEnabled, cb }) {
    //@ts-ignore
    const handleOutsideClick = ({ target }) => {
      if (!node.contains(target)) {
        cb();
      }
    };
    //@ts-ignore
    function update({ enabled }) {
      if (enabled) {
        window.addEventListener("click", handleOutsideClick);
      } else {
        window.removeEventListener("click", handleOutsideClick);
      }
    }

    update({ enabled: initialEnabled });
    return {
      update,
      destroy() {
        window.removeEventListener("click", handleOutsideClick);
      },
    };
  }

  let menuVisible = false;
  function handleLinkClick(event: CustomEvent) {
    menuVisible = event.detail.menu;
  }
</script>

<div
  style="z-index: 20; display:block; opacity: 1;"
  use:clickOutside={{ enabled: menuVisible, cb: () => (menuVisible = false) }}
>
  <div class="open-menu-btn">
    <button
      on:click={() => {
        menuVisible = !menuVisible;
      }}
    >
      <Icon src={Bars3} />
    </button>
  </div>
  {#if menuVisible}
    <div transition:fly={{ x: -300, duration: 200 }} class="header-wrapper">
      <Header {profile} on:closemenu={handleLinkClick} open={menuVisible} />
    </div>
    <div transition:fly={{ x: -300, duration: 200 }} class="close-menu-btn">
      <button
        on:click={() => {
          menuVisible = false;
        }}
      >
        <Icon src={Bars3} />
      </button>
    </div>
  {/if}
</div>

<style>
  button {
    border-radius: 50%;
    color: #856bdc;
  }

  .open-menu-btn {
    display: flex;
    align-items: center;
    position: fixed;
    height: 60px;
    width: 60px;
  }
  .close-menu-btn {
    background-color: rgba(133, 107, 220, 0.5);
    border-radius: 0px 100px 100px 0px;
    display: flex;
    align-items: center;
    position: fixed;
    height: 60px;
    width: 60px;
    margin-left: 250px;
  }
  .header-wrapper {
    display: none;
    z-index: 1004;
    display: block;
    width: 250px;
    position: fixed;
  }
  @media only screen and (min-width: 1024px) {
    .header-wrapper {
      display: none;
    }
    .open-menu-btn {
      display: none;
    }
    .close-menu-btn {
      display: none;
    }
  }
</style>
