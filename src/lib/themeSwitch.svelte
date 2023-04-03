<script lang="ts">
  import { Icon, Moon, Sun } from "svelte-hero-icons";
  import { theme } from "$lib/stores";
  function handleClick() {
    $theme === "dark" ? theme.set("light") : theme.set("dark");
  }
</script>

<button class="icon-button" on:click={handleClick}>
  <Icon src={$theme === "dark" ? Sun : Moon} />
</button>
