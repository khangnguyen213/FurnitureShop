async function fetchReceipts() {
  console.log('Fetching...');

  if (!localStorage.getItem('currentUser')) return;
  const accountId = JSON.parse(
    decodeString(localStorage.getItem('currentUser'))
  )._id;

  const loadingSpiner = document.getElementById('loading-spinner');
  loadingSpiner.style.display = 'flex';

  const response = await fetch(`${Global.BASE_SERVER}/receipt?id=${accountId}`);
  const data = await response.json();

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

  function getParent(el, parentSelector) {
    let element = el;

    if (!element) {
      return element;
    }

    while (element.parentElement) {
      if (element.parentElement.matches(parentSelector)) {
        return element.parentElement;
      }
      element = element.parentElement;
    }
    return element;
  }

  const handleClick = (ev) => {
    const el = ev.currentTarget;
    const trView = getParent(el, 'tr.view');
    const trFold = trView?.nextElementSibling;
    const foldContent = trFold?.querySelector('.fold-content-wrap');

    trView?.classList.toggle('open');
    trFold?.classList.toggle('open');

    if (trFold?.classList.contains('open')) {
      foldContent?.setAttribute(
        'style',
        `height: ${foldContent.scrollHeight}px`
      );
      return true;
    }
    foldContent?.setAttribute('style', `height: 0px`);

    return true;
  };

  const btnAccordionTableList = document.querySelectorAll(
    'button.td-btn-accordion'
  );

  Array.from(btnAccordionTableList).forEach((btn) => {
    btn?.addEventListener('click', handleClick);
  });
}

function displayReceipts(receiptsData) {
  if (!receiptsData) return;
  const receiptsContainer = document.querySelector('.table-accordion-body');
  receiptsData.forEach((receipt) => {
    const purchaseDate = formatUTCDate(receipt.purchaseDate);
    receiptsContainer.innerHTML += `
    <tr class="view">
    <td>
      <button class="td-btn-accordion">
        <svg
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
        >
          <path
            d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"
          />
        </svg>
      </button>
    </td>
    <td class="pcs">${receipt.id}</td>
    <td class="pcs">${receipt.buyerName}</td>
    <td class="cur">${formatMoney(receipt.totalPayment)}</td>
    <td class="per">${purchaseDate}</td>
  </tr>
  <tr class="fold">
    <td colspan="5">
      <div class="fold-content-wrap">
        <div class="fold-content">
          <h3 style="text-align:center">Receipt ID: ${receipt.id}</h3>
          <table>
            <thead>
              <tr>
                <th>Product name</th>
                <th>Price</th>
                <th style="
                text-align: center;
                vertical-align: middle;
            ">Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${receipt.products
                .map(
                  (item) => `
                <tr>
                  <td>${item.product.title}</td>
                  <td>${formatMoney(
                    item.product.discountedprice || item.product.price
                  )}</td>
                  <td style="
                  text-align: center;
                  vertical-align: middle;
              ">${item.quantity}</td> 
                  <td>${formatMoney(
                    item.quantity *
                      (item.product.discountedprice || item.product.price)
                  )}</td>
                </tr>
              `
                )
                .join('')}
              <tr style="background-color:whitesmoke">
                <td colspan="3" style="padding:8px; text-align: right;">Total Payment:</td>
                <td>${formatMoney(receipt.totalPayment)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </td>
  </tr>

  `;
  });
}

fetchReceipts();
