<div></div>

<style>
  div {
    background-color: var(--accent-color);
    /* BROKEN: mobile has to recompute bg when UI bottom bar moves into view. need an absolute bg. need to add support for all browsers*/
    background-image: linear-gradient(
        140deg,
        var(--gradient-1) 70%,
        var(--gradient-2) 80%,
        var(--gradient-3) 85%,
        var(--gradient-4) 90%,
        var(--gradient-5)
      ),
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='100%25' height='100%25'%3E%3Cdefs%3E%3Cpattern id='p' width='100' height='100' patternUnits='userSpaceOnUse' patternTransform='rotate(35) scale(0.46)'%3E%3Cpath id='a' data-color='fill' fill='%239898AC' stroke='%239898AC' stroke-width='13.35' d='M-25 20h50L0-20z'%3E%3C/path%3E%3Cuse xlink:href='%23a' x='100'%3E%3C/use%3E%3Cuse xlink:href='%23a' y='100'%3E%3C/use%3E%3Cuse xlink:href='%23a' x='100' y='100'%3E%3C/use%3E%3Cuse xlink:href='%23a' x='50' y='50'%3E%3C/use%3E%3Cuse xlink:href='%23a' x='50' y='150'%3E%3C/use%3E%3C/pattern%3E%3C/defs%3E%3Crect fill='url(%23p)' width='100%25' height='100%25'%3E%3C/rect%3E%3C/svg%3E");

    background-repeat: no-repeat;
    background-position: center;
    height: 100vh;
    width: 100vw;
    position: fixed;
    /* z-index usage is up to you.. although there is no need of using it because the default stack context will work. */
    z-index: 0;
  }
</style>
