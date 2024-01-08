async function checkout() {
  console.log('Fetching...');

  if (!localStorage.getItem('currentUser')) return;
  const accountId = JSON.parse(
    decodeString(localStorage.getItem('currentUser'))
  )._id;

  const loadingSpiner = document.getElementById('loading-spinner');
  loadingSpiner.style.display = 'flex';
  try {
    const response = await fetch(
      `https://furniture-shop-be.vercel.app/receipt`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accountId }),
      }
    );
    const data = await response.json();

    let receiptData = {
      buyerName: data.receipt.buyername,
      products: data.receipt.productList,
      purchaseDate: data.receipt.paymentDate,
      totalPayment: data.receipt.totalPayment,
    };
    console.log(data.receipt);

    displayReceipt(receiptData);
  } catch (err) {
    console.log(err);
    FuiToast.warning('Something went wrong!');
    loadingSpiner.style.display = 'none';
  }
  loadingSpiner.style.display = 'none';
}

function displayReceipt(receiptData) {
  const receiptModal = document.getElementById('receiptModal');
  receiptModal.style.display = 'flex';
  receiptModal.addEventListener(
    'click',
    () => (receiptModal.style.display = 'none')
  );
  document.getElementById(
    'purchaseDate'
  ).innerText = `Purchase Date: ${receiptData.purchaseDate}`;

  document.getElementById(
    'buyerInfo'
  ).innerHTML = `<strong>Buyer:</strong> ${receiptData.buyerName}`;

  let productsHTML =
    '<div class="productItem"><strong>Product</strong><span style="float:right;"><strong>Price</strong></span></div>';

  receiptData.products.forEach((item) => {
    productsHTML += `
        <div class="productItem">
          ${item.title}<span style="float:right;">${formatMoney(
      item.quantity * importitem.price
    )}</span><br>
          ${item.quantity} x ${formatMoney(item.price)}
        </div>
      `;
  });

  document.getElementById('productsList1').innerHTML = productsHTML;

  document.getElementById('totalPrice').innerText = `Total: ${formatMoney(
    receipt.totalPayment
  )}`;
}
