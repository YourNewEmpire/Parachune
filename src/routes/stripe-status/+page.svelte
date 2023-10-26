<script lang="ts">
  import type { PageData } from "./$types";
  export let data: PageData;

  let { errMsg, payment, link_success } = data;
</script>

{#if errMsg}
  <section>
    <h1>There was an error or your stripe action was cancelled.</h1>
    <p>{errMsg}</p>
  </section>
{:else if payment}
  <section>
    <h1>Payment info</h1>
    <p>{payment.payment_status} @ <a href={payment.payment_url}>this url</a></p>
  </section>
{:else if link_success === true}
  <section>
    <h1>Account link status</h1>
    <p>Successfully created and linked stripe account</p>
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
