<script>
  import { page } from "$app/stores";
</script>

<section style="max-width: 50vw;">
  <h1>{$page.error?.message}</h1>
</section>
