<!-- https://svelte.dev/repl/2f5ab01c05f84790bcb94a0f79afee7b -->
<!-- todo - add script and add prop for dropdown styling. the prop should change the menu direction, up or down -->
<!-- todo - for menu showing under, bottom 100% is omitted and border radius is opposite. then finally it can be reused else where, slightly more elegantly -->
<div>
  <button><slot name="toggle" /></button>
  <menu><slot /></menu>
</div>

<style>
  button {
    border: none;
    background-color: none;
    width: 100%;
    border-radius: 0 0 0.5rem 0.5rem;
    transition: all 0.1s ease;
  }

  menu {
    position: absolute;
    display: block;
    margin-block-end: 0;
    margin-top: 0;
    padding: 0;
    background: linear-gradient(
      260deg,
      var(--bg-color) 80%,
      var(--accent-color)
    );
    transition: opacity 0.1s ease;
    -webkit-transition: opacity 0.1s ease;
    -ms-transition: opacity 0.1s ease;
    -o-transition: opacity 0.1s ease;
    -moz-transition: opacity 0.1s ease;
    visibility: hidden;
    opacity: 0;
    bottom: 100%;
    overflow: hidden;
    border-radius: 0.5rem 0.5rem 0 0;
    width: 100%;
  }

  div:hover,
  div:focus,
  div:hover > menu,
  div:focus > menu,
  div:focus-within > menu,
  button:focus + menu,
  button:hover + menu {
    transition: opacity 0.3s ease;
    -webkit-transition: opacity 0.3s ease;
    -ms-transition: opacity 0.3s ease;
    -o-transition: opacity 0.3s ease;
    -moz-transition: opacity 0.3s ease;
    visibility: visible;
    opacity: 1;
  }
  div:hover,
  div:focus,
  div:hover > button,
  div:focus > button,
  div:focus-within > button,
  button:focus {
    outline: none;
    border-radius: 0 0 0.5rem 0.5rem;
    /* transition: all 0.3s ease; */
    background: linear-gradient(
      250deg,
      var(--bg-color) 70%,
      var(--accent-color)
    );
  }
</style>
