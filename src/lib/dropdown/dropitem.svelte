<li><slot /></li>

<style>
  li {
    /* transition: all 0.4s cubic-bezier(0.86, 0.01, 0.15, 0.99); */
    position: relative;
    display: block;
    transition-duration: 0.2s;
  }
  li:hover,
  li:focus {
    background-color: rgba(0, 0, 0, 0.5);
  }
</style>
