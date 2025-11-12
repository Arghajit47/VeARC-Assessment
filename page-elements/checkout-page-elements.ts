const checkoutPageElements = {
  header: "div.page-title h1",
  billingAddressContinue: "div#checkout-step-billing input[value='Continue']",
  shippingAddressContinue: "div#checkout-step-shipping input[value='Continue']",
  shippingMethodContinue:
    "div#checkout-step-shipping-method input[value='Continue']",
  paymentMethodContinue:
    "div#checkout-step-payment-method input[value='Continue']",
  paymentInfoContinue: "div#checkout-step-payment-info input[value='Continue']",
  checkoutConfirm: "input[value='Confirm']",

  thankYouMessage: {
    title: "div.title strong",
    orderId: "ul.details li",
    continueBtn: "input[value='Continue']",
  },
};

export default checkoutPageElements;
