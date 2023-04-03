<script lang="ts">
  import Header from "$lib/header.svelte";
  import { Icon, Bars3 } from "svelte-hero-icons";
  import { fly } from "svelte/transition";
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
</script>

<div
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
    <div transition:fly={{ x: -300, duration: 500 }} class="header-wrapper">
      <Header />
    </div>
    <div transition:fly={{ x: -300, duration: 500 }} class="close-menu-btn">
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
