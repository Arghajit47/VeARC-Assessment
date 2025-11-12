const productPageElements = {
  accountInfo: "a.account",
  cartCount: "li a.ico-cart span.cart-qty",
  searchBox: "//input[@id='small-searchterms']",
  searchBtn: "//input[@value='Search' and @type='submit']",

  searchModal: {
    header: "div.search-page div h1",
    searchKeywordLabel: `div.search-input form[action="/search"] label[for='Q']`,
    searchKeywordInput: `div.search-input form[action="/search"] input[id='Q']`,
    advanceSearchCheckbox: "div.search-input form[action='/search'] input#As",
    searchBtn:
      "div.search-input form[action='/search'] input[value='Search'][type='submit']",
  },

  products: "div.product-grid div.item-box div.product-item",
  addToCartBtn: `//input[@value='Add to cart']`,
  productName: `//h1[@itemprop="name"]`,
  productPrice: `//span[@itemprop='price']`,
  productQuantity: `//input[@class='qty-input']`,
  addToCartNotification: "p.content",
  notificationCloseBtn: "div#bar-notification span[title='Close']",
};

export default productPageElements;
