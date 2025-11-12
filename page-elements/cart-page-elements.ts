const cartPageElements = {
  cartTableProductName: (name: string) =>
    `//td[@class='product']/a[@class='product-name' and text()='${name}']`,
  cartTableProductPrice: (price: string) =>
    `//td/span[@class='product-unit-price' and text()='${price}']`,
  cartTotal: "span.order-total strong",
  cartTableProductQuantity: (index: number) =>
    `(//td/input[@class='qty-input'])[${index}]`,
  checkoutBtn: "button#checkout",
  termsAndServices: "input#termsofservice",
};

export default cartPageElements;
