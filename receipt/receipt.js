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

  let receiptsData = [];

  data.receipts.forEach(
    ({ accountId, productList, totalPayment, paymentDate }) =>
      receiptsData.push({
        buyerName: accountId.fullname,
        products: productList,
        purchaseDate: paymentDate,
        totalPayment,
      })
  );

  loadingSpiner.style.display = 'none';
  displayReceipts(receiptsData);
}

function displayReceipts(receiptsData) {
  if (!receiptsData) return;
  const receiptsContainer = document.getElementById('receiptsContainer');
  receiptsData.forEach((receipt, index) => {
    const receiptDiv = document.createElement('div');
    receiptDiv.classList.add('receipt');

    receiptDiv.innerHTML = `
        <div class="header">
          <h1>Receipt #${index + 1}</h1>
          <div class="purchaseDate">Purchase Date: ${new Date(
            receipt.purchaseDate
          ).toLocaleDateString()}</div>
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
