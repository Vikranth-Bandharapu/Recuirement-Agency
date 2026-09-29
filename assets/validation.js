/**
 * Apex Talent Partners - Client-Side Form Validation Module
 * Enforces strict validation rules with inline errors and toast feedback
 */

document.addEventListener('DOMContentLoaded', () => {
  initSignupValidation();
  initLoginValidation();
  initContactValidation();
});

/* Helper Regex patterns */
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_PHONE = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{3,5}[-\s\.]?[0-9]{4,6}$/;
// Minimum 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
const REGEX_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=\[\]{}|;:',.<>\/])[A-Za-z\d@$!%*?&#^()_+\-=\[\]{}|;:',.<>\/]{8,}$/;

function showError(inputEl, message) {
  const formGroup = inputEl.closest('.form-group') || inputEl.parentElement;
  inputEl.classList.add('is-invalid');
  formGroup.classList.add('has-error');
  
  let feedback = formGroup.querySelector('.invalid-feedback');
  if (!feedback) {
    feedback = document.createElement('div');
    feedback.className = 'invalid-feedback';
    formGroup.appendChild(feedback);
  }
  feedback.textContent = message;
  feedback.style.display = 'block';
}

function clearError(inputEl) {
  const formGroup = inputEl.closest('.form-group') || inputEl.parentElement;
  inputEl.classList.remove('is-invalid');
  formGroup.classList.remove('has-error');
  const feedback = formGroup.querySelector('.invalid-feedback');
  if (feedback) {
    feedback.style.display = 'none';
  }
}

/* --------------------------------------------------------------------------
   1. Signup Form Validation & Submission Flow
   -------------------------------------------------------------------------- */
function initSignupValidation() {
  const signupForm = document.getElementById('signup-form');
  if (!signupForm) return;

  const nameInput = document.getElementById('signup-name');
  const emailInput = document.getElementById('signup-email');
  const phoneInput = document.getElementById('signup-phone');
  const passwordInput = document.getElementById('signup-password');
  const confirmPasswordInput = document.getElementById('signup-confirm-password');
  const roleRadios = document.querySelectorAll('input[name="signup-role"]');

  // Real-time blur listeners
  if (nameInput) nameInput.addEventListener('blur', validateName);
  if (emailInput) emailInput.addEventListener('blur', validateEmail);
  if (phoneInput) phoneInput.addEventListener('blur', validatePhone);
  if (passwordInput) passwordInput.addEventListener('blur', validatePassword);
  if (confirmPasswordInput) confirmPasswordInput.addEventListener('blur', validateConfirmPassword);

  function validateName() {
    if (!nameInput.value.trim()) {
      showError(nameInput, 'Full Name is required.');
      return false;
    }
    clearError(nameInput);
    return true;
  }

  function validateEmail() {
    const val = emailInput.value.trim();
    if (!val) {
      showError(emailInput, 'Email address is required.');
      return false;
    }
    if (!REGEX_EMAIL.test(val)) {
      showError(emailInput, 'Please enter a valid email address.');
      return false;
    }
    clearError(emailInput);
    return true;
  }

  function validatePhone() {
    const val = phoneInput.value.trim();
    if (!val) {
      showError(phoneInput, 'Phone number is required.');
      return false;
    }
    if (!REGEX_PHONE.test(val.replace(/\s+/g, ''))) {
      showError(phoneInput, 'Please enter a valid phone number (e.g. +91 98765 43210).');
      return false;
    }
    clearError(phoneInput);
    return true;
  }

  function validatePassword() {
    const val = passwordInput.value;
    if (!val) {
      showError(passwordInput, 'Password is required.');
      return false;
    }
    if (!REGEX_PASSWORD.test(val)) {
      showError(passwordInput, 'Password must be at least 8 characters long, contain 1 uppercase, 1 lowercase, 1 number, and 1 special character.');
      return false;
    }
    clearError(passwordInput);
    return true;
  }

  function validateConfirmPassword() {
    const val = confirmPasswordInput.value;
    if (!val) {
      showError(confirmPasswordInput, 'Please confirm your password.');
      return false;
    }
    if (val !== passwordInput.value) {
      showError(confirmPasswordInput, 'Passwords do not match.');
      return false;
    }
    clearError(confirmPasswordInput);
    return true;
  }

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isPassValid = validatePassword();
    const isConfirmValid = validateConfirmPassword();

    let selectedRole = 'Candidate';
    roleRadios.forEach(radio => {
      if (radio.checked) selectedRole = radio.value;
    });

    if (isNameValid && isEmailValid && isPhoneValid && isPassValid && isConfirmValid) {
      // Validated successfully! Show toast and redirect to login
      window.showToast('Account Created!', `Welcome, ${nameInput.value.trim()}. Your ${selectedRole} account is active. Redirecting to Login...`, 'success');
      
      // Clear form sensitive data
      passwordInput.value = '';
      confirmPasswordInput.value = '';

      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);
    } else {
      window.showToast('Validation Error', 'Please check the highlighted fields and try again.', 'error');
    }
  });
}

/* --------------------------------------------------------------------------
   2. Login Form Validation & Role Redirect Flow
   -------------------------------------------------------------------------- */
function initLoginValidation() {
  const loginForm = document.getElementById('login-form');
  if (!loginForm) return;

  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  const roleRadios = document.querySelectorAll('input[name="login-role"]');

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate email
    const emailVal = emailInput.value.trim();
    if (!emailVal || !REGEX_EMAIL.test(emailVal)) {
      showError(emailInput, 'Please enter a valid email address.');
      isValid = false;
    } else {
      clearError(emailInput);
    }

    // Validate password
    if (!passwordInput.value) {
      showError(passwordInput, 'Password is required.');
      isValid = false;
    } else {
      clearError(passwordInput);
    }

    // Determine role selection
    let selectedRole = 'Admin';
    roleRadios.forEach(radio => {
      if (radio.checked) selectedRole = radio.value;
    });

    if (isValid) {
      localStorage.setItem('userEmail', emailVal);
      window.showToast('Login Successful', `Authenticated as ${selectedRole}. Opening dashboard...`, 'success');

      // Clear password field immediately
      passwordInput.value = '';

      setTimeout(() => {
        if (selectedRole === 'Admin') {
          window.location.href = 'admin-dashboard.html';
        } else {
          window.location.href = 'recruiter-dashboard.html';
        }
      }, 1000);
    } else {
      window.showToast('Authentication Failed', 'Please provide valid credentials.', 'error');
    }
  });
}

/* --------------------------------------------------------------------------
   3. Contact Form Validation
   -------------------------------------------------------------------------- */
function initContactValidation() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const phoneInput = document.getElementById('contact-phone');
    const messageInput = document.getElementById('contact-message');

    let isValid = true;

    if (!nameInput.value.trim()) {
      showError(nameInput, 'Full Name is required.');
      isValid = false;
    } else {
      clearError(nameInput);
    }

    if (!emailInput.value.trim() || !REGEX_EMAIL.test(emailInput.value.trim())) {
      showError(emailInput, 'A valid email address is required.');
      isValid = false;
    } else {
      clearError(emailInput);
    }

    if (!phoneInput.value.trim()) {
      showError(phoneInput, 'Phone number is required.');
      isValid = false;
    } else {
      clearError(phoneInput);
    }

    if (!messageInput.value.trim()) {
      showError(messageInput, 'Please write your message or inquiry.');
      isValid = false;
    } else {
      clearError(messageInput);
    }

    if (isValid) {
      window.showToast('Validation Successful', 'Form submission validated successfully. Redirecting...', 'success');
      contactForm.reset();
      setTimeout(() => {
        window.location.href = '404.html';
      }, 1000);
    } else {
      window.showToast('Incomplete Form', 'Please correct the errors before submitting.', 'error');
    }
  });
}
