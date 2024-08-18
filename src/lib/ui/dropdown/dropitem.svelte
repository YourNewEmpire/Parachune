<li><slot /></li>

<style>
  li {
    /* transition: all 0.4s cubic-bezier(0.86, 0.01, 0.15, 0.99); */
    position: relative;
    display: block;
    transition-duration: 0.2s;
    color: var(--text-color);
  }
  li:hover,
  li:focus {
    color: var(--text-secondary-color);
    background-color: var(--text-color);
  }
</style>
