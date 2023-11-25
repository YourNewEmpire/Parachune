<script lang="ts">
  import type { PageData } from "./$types";
  export let data: PageData;

  let { errMsg, paymentStatus, linkSuccess } = data;
</script>

{#if errMsg}
  <section>
    <h1>There was an error or your stripe action was cancelled.</h1>
    <p>{errMsg}</p>
  </section>
{:else if paymentStatus}
  <section>
    <h1>Payment info</h1>
    <p>Status: {paymentStatus}</p>
  </section>
{:else if linkSuccess === true}
  <section>
    <h1>Account link status</h1>
    <p>
      Successfully created and linked stripe account. Other users can donate to
      you with stripe
    </p>
  </section>
{:else}
  <section>
    <h1>Stripe account failed</h1>
    <p>
      Go to <a class="styled-link" href="/account">Account</a> and finish stripe
      link
    </p>
  </section>
{/if}
