function getFirstTwoWords(str) {
  // Remove extra spaces at the beginning and end of the string
  str = str.trim();

  // Find the first space in the string
  const firstSpaceIndex = str.indexOf(' ');

  if (firstSpaceIndex === -1) {
    // If there's no space, return the whole string
    return str;
  } else {
    // Find the index of the next space after the first one
    const secondSpaceIndex = str.indexOf(' ', firstSpaceIndex + 1);

    if (secondSpaceIndex === -1) {
      // If there's only one space, return the string up to that space
      return str.substring(0, firstSpaceIndex);
    } else {
      // If there are two spaces, return the string up to the second space
      return str.substring(0, secondSpaceIndex);
    }
  }
}

function validateMinLength(inputString, minLength) {
  let isValidated = inputString.length >= minLength;
  return {
    status: isValidated,
    message: isValidated
      ? ''
      : `Input must be at least ${minLength} characters`,
  };
}

function validateMaxLength(inputString, maxLength) {
  let isValidated = inputString.length <= maxLength;
  return {
    status: isValidated,
    message: isValidated ? '' : `Input must not exceed ${maxLength} characters`,
  };
}

function validatePasswordComplexity(password) {
  // Define complexity criteria
  const minLength = 8;
  const minUpperCase = 1;
  const minLowerCase = 1;
  const minNumbers = 1;
  const minSpecialChars = 1;
  const specialCharsRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

  // Check length
  if (password.length < minLength) {
    return {
      status: false,
      message: `Password should be at least ${minLength} characters long`,
    };
  }

  // Check for uppercase, lowercase, numbers, and special characters
  let upperCaseCount = 0;
  let lowerCaseCount = 0;
  let numberCount = 0;
  let specialCharCount = 0;

  for (let i = 0; i < password.length; i++) {
    if (/[A-Z]/.test(password[i])) {
      upperCaseCount++;
    } else if (/[a-z]/.test(password[i])) {
      lowerCaseCount++;
    } else if (/\d/.test(password[i])) {
      numberCount++;
    } else if (specialCharsRegex.test(password[i])) {
      specialCharCount++;
    }
  }

  if (
    upperCaseCount < minUpperCase ||
    lowerCaseCount < minLowerCase ||
    numberCount < minNumbers ||
    specialCharCount < minSpecialChars
  ) {
    return {
      status: false,
      message: `Password should contain at least ${minUpperCase} uppercase letter, ${minLowerCase} lowercase letter, ${minNumbers} number, and ${minSpecialChars} special character`,
    };
  }

  return {
    status: true,
    message: '',
  };
}

function validateName(name) {
  // Check if the name is not empty
  if (!name.trim()) {
    return {
      status: false,
      message: 'Name cannot be empty',
    };
  }

  // Check if the name contains only letters and spaces
  const nameRegex = /^[a-zA-Z\s]*$/;
  if (!nameRegex.test(name)) {
    return {
      status: false,
      message: 'Name should contain only letters and spaces',
    };
  }

  // Additional checks like minimum/maximum length or specific formats can be added as needed
  return {
    status: true,
    message: '',
  };
}

function validateEmail(email) {
  // Regular expression for basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Check if the email matches the regular expression
  if (emailRegex.test(email)) {
    return {
      status: true,
      message: '',
    };
  } else {
    return {
      status: false,
      message: 'Please enter a valid email address',
    };
  }
}

function onChangeEmailInput(e) {
  const errElement = document.getElementById('register-email-error');
  errElement.setAttribute('data-isvalidated', false);
  const err = validateEmail(e.target.value);
  if (err.status) {
    errElement.textContent = '';
    errElement.setAttribute('data-isvalidated', true);
  } else {
    errElement.textContent = err.message;
  }
}

function onChangeFullNameInput(e) {
  const errElement = document.getElementById('register-fullname-error');
  errElement.setAttribute('data-isvalidated', false);
  const err = validateName(e.target.value);
  if (err.status) {
    errElement.textContent = '';
    errElement.setAttribute('data-isvalidated', true);
  } else {
    errElement.textContent = err.message;
  }
}

function onChangePasswordInput(e) {
  const errElement = document.getElementById('register-password-error');
  errElement.setAttribute('data-isvalidated', false);
  const err = validatePasswordComplexity(e.target.value);
  if (err.status) {
    errElement.textContent = '';
    errElement.setAttribute('data-isvalidated', true);
  } else {
    errElement.textContent = err.message;
  }
}

function onSubmitRegister(e) {
  e.preventDefault();

  const emailError = document.getElementById('register-email-error');
  const fullNameError = document.getElementById('register-fullname-error');
  const passwordError = document.getElementById('register-password-error');

  if (
    JSON.parse(emailError.getAttribute('data-isvalidated')) &&
    JSON.parse(fullNameError.getAttribute('data-isvalidated')) &&
    JSON.parse(passwordError.getAttribute('data-isvalidated'))
  ) {
    const loadingSpiner = document.getElementById('loading-spinner');
    loadingSpiner.style.display = 'flex';
    const requestBody = {
      email: document.getElementById('register-email').value,
      fullname: document.getElementById('register-fullname').value,
      password: document.getElementById('register-password').value,
    };
    fetch('https://furniture-shop-be.vercel.app/account', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        loadingSpiner.style.display = 'none';

        if (response.status === 200) {
          FuiToast.success('Register Success.');
          return;
        } else {
          return response.text();
        }
      })
      .then((data) => {
        if (data) {
          throw new Error(data);
        } else {
          showLoginModal();
        }
      })
      .catch((err) => {
        const errElement = document.getElementById('register-email-error');
        errElement.textContent = err.message;
      });
  } else {
    FuiToast.warning('Please satisfy input requirement');
  }
}

function checkLogin() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const dataMaxAge = new Date(JSON.parse(localStorage.getItem('dataMaxAge')));
  if (!currentUser) return false;
  if (!dataMaxAge) return false;
  const now = new Date();
  if (now.getTime() > dataMaxAge.getTime()) {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('dataMaxAge');
    return false;
  }
  hideLoginModal();
  showUserBtn();
  const accElement = document.getElementById('username-placeholder');
  now.setHours(now.getHours() + 1);
  accElement.textContent = getFirstTwoWords(currentUser.fullname);
  localStorage.dataMaxAge = JSON.stringify(now);
  return true;
}

function onSubmitLogin(e) {
  e.preventDefault();
  const loadingSpiner = document.getElementById('loading-spinner');
  loadingSpiner.style.display = 'flex';
  const requestBody = {
    email: document.getElementById('login-email').value,
    password: document.getElementById('login-password').value,
  };
  fetch('https://furniture-shop-be.vercel.app/account/login', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => {
      loadingSpiner.style.display = 'none';
      if (response.status === 200) {
        FuiToast.success('Login Success');
        return response.json();
      } else {
        return response.text();
      }
    })
    .then((data) => {
      if (!data._id) {
        throw new Error(data);
      } else {
        hideLoginModal();
        showUserBtn();
        const accElement = document.getElementById('username-placeholder');
        const now = new Date();
        now.setHours(now.getHours() + 1);
        accElement.textContent = getFirstTwoWords(data.fullname);
        localStorage.currentUser = JSON.stringify(data);
        localStorage.dataMaxAge = JSON.stringify(now);
        setTimeout(
          () => FuiToast.success(`Welcome back, ${data.fullname}`),
          1000
        );
      }
    })
    .catch((err) => {
      const errElement = document.getElementById('login-error');
      errElement.textContent = err.message;
    });
}

function onClickLogout() {
  hideUserBtn();
  showLoginBtn();
  const accElement = document.getElementById('username-placeholder');
  accElement.textContent = '';
  localStorage.removeItem('currentUser');
  localStorage.removeItem('dataMaxAge');
  FuiToast.success(`Success logout`);
  setTimeout(() => location.reload(), 300);
}

function stopPropagation(e) {
  e.stopPropagation();
}
function hideLoginModal() {
  const loginModal = document.getElementById('login-modal');
  loginModal.style.display = 'none';
}

function showLoginModal() {
  hideRegisterModal();
  const modal = document.getElementById('login-modal');
  modal.style.display = 'flex';
}

function hideRegisterModal() {
  const modal = document.getElementById('register-modal');
  modal.style.display = 'none';
}

function showRegisterModal() {
  hideLoginModal();
  const modal = document.getElementById('register-modal');
  modal.style.display = 'flex';
}

function hideLoginBtn() {
  const btn = document.getElementsByClassName('user-inactive')[0];
  btn.style.display = 'none';
}

function showLoginBtn() {
  hideUserBtn();
  const btn = document.getElementsByClassName('user-inactive')[0];
  btn.style.display = 'flex';
}

function hideUserBtn() {
  const btn = document.getElementsByClassName('user-active');
  btn[0].style.display = 'none';
  btn[1].style.display = 'none';
}
function showUserBtn() {
  hideLoginBtn();
  const btn = document.getElementsByClassName('user-active');
  btn[0].style.display = 'flex';
  btn[1].style.display = 'flex';
}

function formatMoney(amount) {
  // Convert the number to a string and split it into parts before and after the decimal point
  const parts = amount.toString().split('.');

  // Add commas as thousand separators to the part before the decimal point
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  // Join the parts back together with a period (.) as the decimal separator
  return parts.join('.');
}

function createLoginRegisterModal() {
  const loginModal = document.getElementById('login-modal');
  const registerModal = document.getElementById('register-modal');
  loginModal.innerHTML = `<div class="bt-form-login-simple-1" onclick="stopPropagation(event)">
  <h1 class="form-heading">Welcome Back</h1>
  <form class="form" onsubmit="onSubmitLogin(event)" autocomplete="off">
    <div class="form-group">
      <label for="email">Email *</label>
      <input
        type="text"
        name="email"
        id="login-email"
        placeholder="Email"
        class="form-input"
      />
    </div>
    <div class="form-group">
      <label for="password">Password *</label>
      <input
        type="password"
        name="password"
        id="login-password"
        placeholder="Password"
        class="form-input"
      />
      <span class="error-message" id="login-error"></span>
    </div>
    <div class="form-meta">
      <a href="#" class="form-link"> Forgot Password </a>
    </div>
    <button type="submit" class="form-btn">Login</button>
  </form>
  <div class="form-option">
    Dont&#x27;t have am account?
    <a href="#" onclick="showRegisterModal()">Sign up for free</a>
  </div>
</div>`;

  registerModal.innerHTML = ` <div class="bt-form-login-simple-1" onclick="stopPropagation(event)">
<h1 class="form-heading">Welcome to Furnio</h1>
<form
  class="form"
  onsubmit="onSubmitRegister(event)"
  autocomplete="off"
>
  <div class="form-group">
    <label for="email">Email *</label>
    <input
      type="text"
      name="email"
      id="register-email"
      placeholder="Email"
      class="form-input"
      onchange="onChangeEmailInput(event)"
    />
    <span class="error-message" id="register-email-error"></span>
  </div>
  <div class="form-group">
    <label for="fullname">Full Name *</label>
    <input
      type="text"
      name="fullname"
      id="register-fullname"
      placeholder="Full Name"
      class="form-input"
      onchange="onChangeFullNameInput(event)"
    />
    <span class="error-message" id="register-fullname-error"></span>
  </div>
  <div class="form-group">
    <label for="password">Password *</label>
    <input
      type="password"
      name="password"
      id="register-password"
      placeholder="Password"
      class="form-input"
      onchange="onChangePasswordInput(event)"
    />
    <span class="error-message" id="register-password-error"></span>
  </div>

  <button type="submit" class="form-btn">Register</button>
</form>
<div class="form-option">
  Already have am account?
  <a href="#" onclick="showLoginModal()">Sign in Here</a>
</div>
</div>`;
}

function createHeaderFooter() {
  const headerEl = document.querySelector('header');
  const footerEl = document.querySelector('footer');

  const rootUrl = location.origin;
  headerEl.innerHTML = `
  <a id="header-left" href="./">
    <img
      src="./assest/Meubel House_Logos-05.png"
      width="50px"
      height="32px"
    />
    <h1>Furnio</h1>
  </a>

  <div id="header-center">
    <a href="${rootUrl}">Home</a>
    <a href="${rootUrl}/shop">Shop</a>
    <a href="${rootUrl}/#">About</a>
    <a href="${rootUrl}/#">Contact</a>
  </div>

  <div id="header-right">
    <a href="#" onclick="showLoginModal()" class="user-btn user-inactive">
      <img src="./assest/icons/mdi_account-alert-outline.png" />
      <span>Login</span>
    </a>

    <a href="#" class="user-btn user-active">
      <img src="./assest/icons/mdi_account-alert-outline.png" />
      <span id="username-placeholder"></span>
    </a>

    <a href="#">
      <img class="small-icon" src="./assest/icons/akar-icons_heart.png" />
    </a>
    <a href="${rootUrl}/cart/">
      <img
        class="small-icon"
        src="./assest/icons/ant-design_shopping-cart-outlined.png"
      />
    </a>
    <a href="#" onclick="onClickLogout()">
      <img
        class="small-icon user-active"
        src="./assest/icons/sign-out.png"
      />
    </a>
  </div>
  `;
}

createHeaderFooter();
