<script lang="ts">
  import Disc from "svelte-bootstrap-icons/lib/Disc.svelte";
  import { songsQueued } from "$lib/stores";
  export let paused: Boolean;
</script>

<div>
  <span style:animation-play-state={paused === false ? "running" : "paused"}>
    <Disc class="disc-icon" />
  </span>

  <article>
    <a class="styled-link" href="/songs/{$songsQueued[0]?.id}">
      {$songsQueued[0]?.name}
    </a>
    <a class="styled-link" href="/profiles/{$songsQueued[0]?.artistId}">
      {$songsQueued[0]?.artistName}
    </a>
  </article>
</div>

<style>
  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.2rem;
  }

  article {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    overflow: hidden;
    font-size: 0.5rem;
    max-width: 100%;
  }

  a {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  span {
    animation: spin 2s linear infinite;
    animation-play-state: paused;
  }

  :global(.disc-icon) {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 1rem;
    height: 100%;
  }
  @media only screen and (min-width: 500px) {
    article {
      font-size: 1rem;
    }
    :global(.disc-icon) {
      width: 1.5rem;
    }
  }
  @media only screen and (min-width: 1024px) {
    article {
      gap: 0.5rem;
    }
  }
  @-moz-keyframes spin {
    from {
      -moz-transform: rotate(0deg);
    }
    to {
      -moz-transform: rotate(360deg);
    }
  }
  @-webkit-keyframes spin {
    from {
      -webkit-transform: rotate(0deg);
    }
    to {
      -webkit-transform: rotate(360deg);
    }
  }
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
