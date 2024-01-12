async function checkout() {
  console.log('Fetching..');

  if (!localStorage.getItem('currentUser')) return;
  const accountId = JSON.parse(
    decodeString(localStorage.getItem('currentUser'))
  )._id;

  const loadingSpiner = document.getElementById('loading-spinner');
  loadingSpiner.style.display = 'flex';
  try {
    const response = await fetch(`${Global.BASE_SERVER}/receipt`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accountId }),
    });
    const data = await response.json();

    let receiptData = {
      buyerName: data.receipt.buyername,
      products: data.receipt.productList,
      purchaseDate: data.receipt.paymentDate,
      totalPayment: data.receipt.totalPayment,
    };
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
  const subtotalEl = document.getElementById('payment_subtotal');
  const totalEl = document.getElementById('payment_total');
  const discountedEl = document.getElementById('payment_discounted');

  receiptModal.style.display = 'flex';
  receiptModal.addEventListener('click', async () => {
    receiptModal.style.display = 'none';
    await fetchCarts();
    displayCart();
    subtotalEl.innerText = `0`;
    discountedEl.innerText = `0`;
    totalEl.innerText = `0`;
  });
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
      item.quantity * item.price
    )}</span><br>
          ${item.quantity} x ${formatMoney(item.price)}
        </div>
      `;
  });

  document.getElementById('productsList1').innerHTML = productsHTML;

  document.getElementById('totalPrice').innerText = `Total: ${formatMoney(
    receiptData.totalPayment
  )}`;
}

document
  .getElementById('btn-checkout')
  .addEventListener('click', () => checkout());
