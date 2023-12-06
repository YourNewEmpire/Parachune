<!-- https://svelte.dev/repl/2f5ab01c05f84790bcb94a0f79afee7b -->

<div>
  <button><slot name="toggle" /></button>
  <menu><slot /></menu>
</div>

<style>
  button {
    border: none;
    background-color: inherit;
    width: 100%;
  }

  menu {
    position: absolute;
    display: block;
    margin-block-end: 0;
    padding: 0;
    border: 1px solid black;
    background: linear-gradient(240deg, black 60%, #856bdc);
    transition: opacity 0.1s ease;
    -webkit-transition: opacity 0.1s ease;
    -ms-transition: opacity 0.1s ease;
    -o-transition: opacity 0.1s ease;
    -moz-transition: opacity 0.1s ease;
    visibility: hidden;
    opacity: 0;
    bottom: 100%;
    overflow: hidden;
    border-radius: 0.5rem;
    width: 100%;
  }

  div:hover,
  div:focus,
  div:hover > menu,
  div:focus > menu {
    transition: opacity 0.3s ease;
    -webkit-transition: opacity 0.3s ease;
    -ms-transition: opacity 0.3s ease;
    -o-transition: opacity 0.3s ease;
    -moz-transition: opacity 0.3s ease;
    visibility: visible;
    opacity: 1;
  }
</style>
