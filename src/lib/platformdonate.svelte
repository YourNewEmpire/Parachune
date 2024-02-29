<script lang="ts">
  import Stripe from "svelte-bootstrap-icons/lib/Stripe.svelte";
  import { addToast } from "./stores";
  import tooltip from "./utils/tooltip";

  async function createDonation() {
    addToast({
      type: "info",
      dismissable: false,
      message: "Waiting for redirect to Stripe donation checkout...",
      timeout: 10000,
    });
    const response = await fetch("/api/donation", {
      method: "POST",
    });
    if (!response) {
      addToast({
        type: "failure",
        dismissable: false,
        message: "No response from server, try again.",
        timeout: 10000,
      });
    }
    const stripeLink = await response.json();
    if (!stripeLink) {
      addToast({
        type: "failure",
        dismissable: false,
        message:
          "Server side failed to return a stripe url, try again or contact the dev",
        timeout: 10000,
      });
    }
    window.location.href = stripeLink;
  }
</script>

<button
  use:tooltip={{ content: "Secured with Stripe" }}
  class="styled-button"
  style="gap: 0.5rem;"
  on:click={() => createDonation()}
>
  <Stripe /> Donate to Parachune
</button>
