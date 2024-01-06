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
}

function displayReceipts(receiptsData) {
  if (!receiptsData) return;
  const receiptsContainer = document.getElementById('receiptsContainer');
  receiptsData.forEach((receipt) => {
    const receiptDiv = document.createElement('div');
    receiptDiv.classList.add('receipt');

    receiptDiv.innerHTML = `
        <div class="header">
          <h1>Receipt</h1>
          <small>No.${receipt.id}</small>
          <div class="purchaseDate">Purchase Date: ${formatUTCDate(
            receipt.purchaseDate
          )}</div>
        </div>
        <div class="buyerInfo"><strong>Buyer:</strong> ${
          receipt.buyerName
        }</div>
        <div class="productsList">
          <div class="productItem"><strong>Product</strong><span style="float:right;"><strong>Price</strong></span></div>
          ${receipt.products
            .map(
              (item) => `
                <div class="itemItem">
                  ${item.product.title}<span style="float:right;">${formatMoney(
                item.quantity * item.product.discountedprice ||
                  item.product.price
              )}</span><br>
                  ${item.quantity} x ${formatMoney(
                item.product.discountedprice || item.product.price
              )}
                </div>
              `
            )
            .join('')}
        </div>
        <div class="totalPrice">Total: ${formatMoney(
          receipt.totalPayment
        )}</div>
      `;

    receiptDiv.classList.add('receipt');
    receiptsContainer.appendChild(receiptDiv);
  });
}

fetchReceipts();
