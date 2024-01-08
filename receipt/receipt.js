async function fetchReceipts() {
  console.log('Fetching...');

  if (!localStorage.getItem('currentUser')) return;
  const accountId = JSON.parse(
    decodeString(localStorage.getItem('currentUser'))
  )._id;

  const loadingSpiner = document.getElementById('loading-spinner');
  loadingSpiner.style.display = 'flex';

  const response = await fetch(
    `https://furniture-shop-be.vercel.app/receipt?id=${accountId}`
  );
  const data = await response.json();
  console.log(data.receipts[0]._id);

  let receiptsData = [];

  data.receipts.forEach(
    ({ accountId, productList, totalPayment, paymentDate, _id }) =>
      receiptsData.push({
        buyerName: accountId.fullname,
        products: productList,
        purchaseDate: paymentDate,
        totalPayment,
        id: _id,
      })
  );

  loadingSpiner.style.display = 'none';
  displayReceipts(receiptsData);

  const accordionContent = document.querySelectorAll(
    '.fui-accordion .accordion-content'
  );
  accordionContent.forEach((item, index) => {
    const iconPlus = item.querySelector('.fui-accordion .icon-plus');
    const iconMinus = item.querySelector('.fui-accordion .icon-minus');
    let header = item.querySelector('header');
    item.classList.remove('open');
    header.addEventListener('click', () => {
      item.classList.toggle('open');

      let description = item.querySelector('.description');
      if (item.classList.contains('open')) {
        description.style.height = `${description.scrollHeight}px`;
        iconPlus.classList.add('hidden');
        iconMinus.classList.add('active');
      } else {
        description.style.height = '0px';
        iconPlus.classList.remove('hidden');
        iconMinus.classList.remove('active');
      }
      removeOpen(index);
    });
  });

  function removeOpen(index1) {
    accordionContent.forEach((item2, index2) => {
      const iconPlus = item2.querySelector('.fui-accordion .icon-plus');
      const iconMinus = item2.querySelector('.fui-accordion .icon-minus');
      if (index1 != index2) {
        item2.classList.remove('open');

        let des = item2.querySelector('.description');
        des.style.height = '0px';
        iconPlus.classList.remove('hidden');
        iconMinus.classList.remove('active');
      }
    });
  }
}

function displayReceipts(receiptsData) {
  if (!receiptsData) return;
  const receiptsContainer = document.querySelector('.fui-accordion');
  receiptsData.forEach((receipt) => {
    receiptsContainer.innerHTML += ` <div class="accordion-content">
    <header>
      <span class="title">Receipt: #${
        receipt.id
      }<strong style="float:right">Purchase Date: ${formatUTCDate(
      receipt.purchaseDate
    )}</strong></span>
      <span class="icon icon-plus">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M13 7C13 6.44772 12.5523 6 12 6C11.4477 6 11 6.44772 11 7V11H7C6.44772 11 6 11.4477 6 12C6 12.5523 6.44772 13 7 13H11V17C11 17.5523 11.4477 18 12 18C12.5523 18 13 17.5523 13 17V13H17C17.5523 13 18 12.5523 18 12C18 11.4477 17.5523 11 17 11H13V7Z"
            fill="currentColor"
          />
        </svg>
      </span>
      <span class="icon icon-minus">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M6 12C6 11.4477 6.44772 11 7 11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13H7C6.44772 13 6 12.5523 6 12Z"
            fill="currentColor"
          />
        </svg>
      </span>
    </header>

    <div class="description">
  <div class="buyer-info"><strong>Buyer:</strong> ${receipt.buyerName}</div>
  <div class="products-list">
    <div class="product-header">
      <strong>Product</strong>
      <span class="price-header"><strong>Price</strong></span>
    </div>
    ${receipt.products
      .map(
        (item) => `
      <div class="product-item">
        ${item.product.title}
        <span class="item-price">${formatMoney(
          item.quantity * (item.product.discountedprice || item.product.price)
        )}</span><br>
        ${item.quantity} x ${formatMoney(
          item.product.discountedprice || item.product.price
        )}
      </div>
    `
      )
      .join('')}
  </div>
  <div class="total-price">Total: ${formatMoney(receipt.totalPayment)}</div>
</div>

  </div>
  `;
  });
}

fetchReceipts();
