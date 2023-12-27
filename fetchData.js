function formatMoney(amount) {
  // Convert the number to a string and split it into parts before and after the decimal point
  const parts = amount.toString().split('.');

  // Add commas as thousand separators to the part before the decimal point
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  // Join the parts back together with a period (.) as the decimal separator
  return parts.join('.');
}

async function fetchProducts() {
  console.log('Fetching...');
  const cards = document.getElementById('productsList');
  let productsHtml = ``;

  const response = await fetch('https://furniture-shop-be.vercel.app/product');
  const data = await response.json();
  //   console.log(data.products);
  data.products.forEach(
    (product) =>
      (productsHtml += `<div class="card">
    <img src=${product.images[0]} />
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
