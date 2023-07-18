<script lang="ts">
  import { loadScript } from "@paypal/paypal-js";

  export let cartTotal = 0.01;
  const CLIENT_ID =
    "AcIRN8E_ggIpsFeIMMo7b6ctsLHEjv_GK8sCpKHwI3v2DHpo-_VBf05LtcbdoKv2T_L1l7uTjNGb8lif"; // change this to your own client id

  loadScript({ clientId: CLIENT_ID }).then((paypal) => {
    //@ts-ignore
    paypal
      .Buttons({
        style: {
          color: "blue",
          shape: "pill",
        },
        //@ts-ignore
        createOrder: function (data, actions) {
          // Set up the transaction
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: cartTotal.toString(),
                },
              },
            ],
          });
        },
        //@ts-ignore
        onApprove: function (data, actions) {
          // Capture order after payment approved
          //@ts-ignore
          return actions?.order.capture().then(function (details) {
            alert("Payment successful!");
          });
        },
        //@ts-ignore
        onError: function (err) {
          // Log error if something goes wrong during approval
          alert("Something went wrong");
          console.log("Something went wrong", err);
        },
      })
      .render("#paypal-button-container");
  });
</script>

<div id="paypal-button-container" />

<style>
  #paypal-button-container {
    margin: 30px 0;
  }
</style>
