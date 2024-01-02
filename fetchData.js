function formatMoney(amount) {
  // Convert the number to a string and split it into parts before and after the decimal point
  const parts = amount.toString().split('.');

  // Add commas as thousand separators to the part before the decimal point
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  // Join the parts back together with a period (.) as the decimal separator
  return parts.join('.');
}

async function onAddCart(productId, quantity, productTitle) {
  if (!localStorage.getItem('currentUser'))
    return FuiToast.info('You must login to use cart');
  const accountId = JSON.parse(localStorage.getItem('currentUser'))._id;
  const requestBody = {
    accountId,
    productId,
    quantity,
  };
  const loadingSpiner = document.getElementById('loading-spinner');
  loadingSpiner.style.display = 'flex';
  const response = await fetch(`https://furniture-shop-be.vercel.app/cart`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });
  loadingSpiner.style.display = 'none';
  if (response.status != 200) return FuiToast.warning('Something went wrong!');
  FuiToast.success(`${quantity} x ${productTitle} added to your cart`, {
    title: 'Success',
  });
}

async function fetchProducts() {
  console.log('Fetching...');
  const cards = document.getElementById('productsList');
  let productsHtml = ``;

  const response = await fetch('https://furniture-shop-be.vercel.app/product');
  const data = await response.json();
  data.products.forEach(
    (product) =>
      (productsHtml += `<div class="card">
   

    <img src=${product.images[0]} />
    <button class="btn" onclick="onAddCart('${product._id}',1,'${
        product.title
      }')">Add to Cart</button>
    <div class="content">
      <h2>${product.title}</h2>
      <div class="price">
        <p class="discount-price">${formatMoney(product.discountedprice)}</p>
        <p class="normal-price">${formatMoney(product.price)}</p>
      </div>
    </div>

  </div>`)
  );
  cards.innerHTML = productsHtml;
}

async function fetchCarts() {
  console.log('Fetching...');
  if (!localStorage.getItem('currentUser')) return;
  const accountId = JSON.parse(localStorage.getItem('currentUser'))._id;
  const cards = document.getElementById('productsList');
  let productsHtml = ``;
  const loadingSpiner = document.getElementById('loading-spinner');
  loadingSpiner.style.display = 'flex';
  const response = await fetch(
    `https://furniture-shop-be.vercel.app/cart?id=${accountId}`
  );
  const data = await response.json();
  loadingSpiner.style.display = 'none';
  if (data.products.length === 0) {
    cards.innerHTML =
      '<p style="text-align:center; grid-column: 1 / end">Your cart is empty</p>';
    return;
  }
  data.products.forEach(
    ({ product, quantity }) =>
      (productsHtml += `<div class="card">
    <img src=${product.images[0]} />
    <div class="content">
      <h2>${product.title}</h2>
      <div class="price">
        <p class="discount-price">${formatMoney(product.discountedprice)}</p>
        <p class="normal-price">${formatMoney(product.price)}</p>
      </div>
      <div class="price">
      <button class="button1">-</button>
      <h2>${quantity}</h2>
      <button class="button2">+</button>
    </div>
    </div>
  </div>`)
  );
  cards.innerHTML = productsHtml;
}
