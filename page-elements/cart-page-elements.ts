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
  cartTable: "table.cart",
  // Cart table parsing locators
  cartTableHeaders: "thead th",
  cartTablePictureColumn: ".picture",
  cartTableRows: "tbody tr.cart-item-row",
  cartTableCells: "td",
  cartTableRemoveCheckbox: 'input[name="removefromcart"]',
  cartTableImage: "img",
  cartTableProductNameLink: "a.product-name",
  cartTableAttributes: ".attributes",
  cartTablePriceSpan: "span.product-unit-price",
  cartTableQuantityInput: "input.qty-input",
  cartTableSubtotal: ".product-subtotal",
};

export default cartPageElements;
