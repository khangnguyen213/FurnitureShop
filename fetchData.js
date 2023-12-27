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
        <p class="discount-price">${product.discountedprice}</p>
        <p class="normal-price">${product.price}</p>
      </div>
    </div>
  </div>`)
  );
  cards.innerHTML = productsHtml;
}
