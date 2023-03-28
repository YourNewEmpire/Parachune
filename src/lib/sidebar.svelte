<script>
  import { theme } from "./stores";
</script>

<div class="layout-sidebar-{$theme}">
  <p>Sidebar for messaging and notifications</p>
</div>

<style>
  .layout-sidebar-light {
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    height: 100vh;
    background-color: rgba(210, 210, 210, 1);
    color: #7a5bdf;
    font-size: 1rem;
    font-weight: 600;
    text-align: center;
    padding: 10px;
    display: flex;
    flex-direction: column;
    column-gap: 2rem;
  }
  .layout-sidebar-dark {
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    height: 100vh;
    background-color: rgba(38, 30, 30, 1);
    color: #7a5bdf;
    font-size: 1rem;
    font-weight: 600;
    text-align: center;
    padding: 10px;
    display: flex;
    flex-direction: column;
    column-gap: 2rem;
  }
</style>
