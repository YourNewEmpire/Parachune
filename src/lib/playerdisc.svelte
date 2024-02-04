<script>
  import Disc from "svelte-bootstrap-icons/lib/Disc.svelte";
</script>

<div>
  <button>
    <Disc class="disc-icon" />
  </button>
  <article>
    <a class="text-ellipsis" style="max-width: 18ch;" href="/">
      album tester #1
    </a>
    <a class="text-ellipsis" style="max-width: 16ch;" href="/profiles">
      ExampleProfile
    </a>
  </article>
</div>

<style>
  div {
    position: relative;
  }
  button {
    border: none;
    background-color: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 0.1rem 0.1rem;
    color: inherit;
  }

  :global(.disc-icon) {
    width: 100%;
    height: 100%;
    transition: transform 0.2s ease;
    transform: rotate(0deg);
  }
  div:hover :global(.disc-icon),
  div:focus :global(.disc-icon) {
    transition: transform 0.5s ease;
    transform: rotate(360deg);
  }
  @media only screen and (min-width: 768px) {
    :global(.disc-icon) {
      width: 2.5rem;
    }
    button {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      padding: 0.5rem 0.5rem;
      background: none;
      color: inherit;
      text-decoration: none;
      cursor: pointer;
    }
  }
  @media only screen and (min-width: 1024px) {
    button {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      padding: 0.5rem 0.5rem;
      background: none;
      color: inherit;
      text-decoration: none;
      cursor: pointer;
    }
  }
  article {
    border: 1px solid red;
    display: flex;
    flex-direction: column;
    position: absolute;
    visibility: hidden;
    opacity: 0;
    top: 25%;
    left: 100%;
    transition: all 0.1s ease;
    transform: translateY(100%);
    -webkit-transition: all 0.1s ease;
    -ms-transition: all 0.1s ease;
    -o-transition: all 0.1s ease;
    -moz-transition: all 0.1s ease;
  }
  div:hover,
  div:focus,
  div:hover > article,
  div:focus > article,
  div:focus-within > article,
  button:hover + article,
  button:focus + article {
    transition: all 0.3s ease;
    -webkit-transition: all 0.3s ease;
    -ms-transition: all 0.3s ease;
    -o-transition: all 0.3s ease;
    -moz-transition: all 0.3s ease;
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
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
