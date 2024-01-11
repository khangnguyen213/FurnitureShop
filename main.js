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
  const accountId = JSON.parse(
    decodeString(localStorage.getItem('currentUser'))
  )._id;
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
  if (location.pathname != '/cart/') {
    loadingSpiner.style.display = 'none';
    fetchCarts();
  }
  if (response.status != 200) return FuiToast.warning('Something went wrong!');
  if (quantity > 0)
    FuiToast.success(`${quantity} x ${productTitle} added to your cart`, {
      title: 'Success',
      isClose: true,
    });

  if (quantity < 0)
    FuiToast.success(`${quantity} x ${productTitle} removed your cart`, {
      title: 'Success',
      isClose: true,
    });

  if (location.pathname == '/cart/') {
    await fetchCarts();
    loadingSpiner.style.display = 'none';
    displayCart();
  }
}

async function onDeleteCart(productId, productTitle) {
  if (!localStorage.getItem('currentUser')) return;
  const accountId = JSON.parse(
    decodeString(localStorage.getItem('currentUser'))
  )._id;
  const requestBody = {
    accountId,
    productId,
  };
  const loadingSpiner = document.getElementById('loading-spinner');
  loadingSpiner.style.display = 'flex';
  const response = await fetch(`https://furniture-shop-be.vercel.app/cart`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (response.status != 200) return FuiToast.warning('Something went wrong!');
  await fetchCarts();
  loadingSpiner.style.display = 'none';
  FuiToast.success(` ${productTitle} removed from your cart`, {
    title: 'Success',
    isClose: true,
  });
  displayCart();
}

let pageNumber = 1;

async function fetchProducts() {
  console.log('Fetching...');
  const loadingSpiner = document.getElementById('loading-spinner');
  loadingSpiner.style.display = 'flex';
  const cards = document.getElementById('productsList');
  let productsHtml = ``;

  const response = await fetch(
    `https://furniture-shop-be.vercel.app/product?pageNumber=${pageNumber++}&nPerPage=8`
  );
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
  cards.innerHTML += productsHtml;
  loadingSpiner.style.display = 'none';
}

async function fetchCarts() {
  console.log('Fetching...');

  if (!localStorage.getItem('currentUser')) return;
  const accountId = JSON.parse(
    decodeString(localStorage.getItem('currentUser'))
  )._id;

  // const loadingSpiner = document.getElementById('loading-spinner');
  // loadingSpiner.style.display = 'flex';
  const response = await fetch(
    `https://furniture-shop-be.vercel.app/cart?id=${accountId}`
  );
  const data = await response.json();
  // loadingSpiner.style.display = 'none';
  if (data) {
    document.querySelector('.number').innerText = data.products.reduce(
      (sum, current) => (sum += current.quantity),
      0
    );
    localStorage.productsInCart = JSON.stringify(data);
  } else {
    document.querySelector('.number').innerText = 0;
  }
}

function displayCart() {
  const data = JSON.parse(localStorage.productsInCart);
  if (!data) {
    fetchCarts();
    displayCart();
  }
  const subtotalEl = document.getElementById('payment_subtotal');
  const totalEl = document.getElementById('payment_total');
  const discountedEl = document.getElementById('payment_discounted');
  const table_body = document.querySelector('.fui-table-body');
  let bodyHtml = ``;
  if (data.products.length === 0) {
    table_body.innerHTML = ` <tr style="background-color:whitesmoke">
      <td colspan="6" style="padding:8px; text-align: center;">Your cart is empty</td>
    </tr>`;
    return;
  }
  data.products.forEach(
    ({ product, quantity }) =>
      (bodyHtml += `
      <tr>
      <td>${product.title}</td>
      <td>${formatMoney(product.discountedprice * quantity)}</td>
      <td>
      <button class="button1" onclick="onAddCart('${product._id}',-1, '${
        product.title
      }')">-</button>
      </td>
      <td style=" text-align: center;
      vertical-align: middle;">${quantity}</td>
      <td>
      <button class="button2" onclick="onAddCart('${product._id}',1, '${
        product.title
      }')">+</button>
      </td>
<td><button class="btn1 btn-delete" onclick="onDeleteCart('${product._id}', '${
        product.title
      }')">×</button></td>
    </tr>
      `)
  );

  table_body.innerHTML = bodyHtml;
  subtotalEl.innerText = `${formatMoney(data.totalPrice)}`;
  discountedEl.innerText = `${formatMoney(data.totalDiscounted)}`;
  totalEl.innerText = `${formatMoney(data.totalDiscountedPrice)}`;
}
