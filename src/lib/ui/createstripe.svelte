<script lang="ts">
  import { addToast } from "../stores";

  async function createAccount() {
    addToast({
      type: "info",
      dismissable: false,
      message: "Waiting for redirect to Stripe account setup...",
      timeout: 10000,
    });
    const response = await fetch("/api/linkstripe", {
      method: "POST",
    });
    if (!response) {
      addToast({
        type: "failure",
        dismissable: false,
        message: "No response from server",
        timeout: 10000,
      });
      return;
    }

    const stripeLink = await response.json();
    if (!stripeLink.url) {
      addToast({
        type: "failure",
        dismissable: false,
        message: "There was a problem creating stripe account for Parachune",
        timeout: 10000,
      });
      return;
    }

    window.location.href = stripeLink.url;
  }
</script>

<button class="styled-button" on:click={() => createAccount()}>
  Create linked stripe account
</button>
