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
  if (!currentUser) return;
  if (!dataMaxAge) return;
  const now = new Date();
  if (now.getTime() > dataMaxAge.getTime()) return;
  hideLoginModal();
  showUserBtn();
  const accElement = document.getElementById('username-placeholder');
  now.setHours(now.getHours() + 1);
  accElement.textContent = getFirstTwoWords(currentUser.fullname);
  localStorage.dataMaxAge = JSON.stringify(now);
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
}
