import '@babel/polyfill';

import { login, logout } from './login';
import { displayMap } from './mapBox';
import { signUp } from './signup';
import { updateSettings } from './updateSettings';
import { forgotPass, resetPass } from './passwordSettings';
import { bookTour } from './stripe';

// DOM ELEMENT
const mapBox = document.getElementById('map');
const loadForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const loadSignUpForm = document.querySelector('.form--signup');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-settings');
const forgotPassword = document.querySelector('.form--resetPass');
const resetPassword = document.querySelector('.form--resetPass');
const bookBtn = document.getElementById('book-tour');

// Maap box section
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

// User logged in form
if (loadForm) {
  loadForm.addEventListener('submit', e => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
}

// Logged out button
if (logoutBtn) logoutBtn.addEventListener('click', logout);

// Sign up new user form
if (loadSignUpForm) {
  loadSignUpForm.addEventListener('submit', async e => {
    e.preventDefault();
    const form = new FormData();

    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('password', document.getElementById('password').value);
    form.append(
      'confirmPassword',
      document.getElementById('confirmPassword').value
    );
    form.append('photo', document.getElementById('photo').files[0]);
    signUp(form, 'data');
  });
}

// User data form
if (userDataForm) {
  userDataForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-settings').textContent = 'Updating...';

    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    await updateSettings(form, 'data');

    document.querySelector('.btn--save-settings').textContent = 'Save settings';
  });
}

// User password form
if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('password-confirm').value;

    await updateSettings(
      { passwordCurrent, password, confirmPassword },
      'password'
    );
    document.querySelector('.btn--save-password').textContent = 'Save Password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

// Forgor user password form
if (forgotPassword) {
  forgotPassword.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--send-email').textContent = 'Sending Email...';
    const email = document.getElementById('email').value;

    await forgotPass(email);

    document.querySelector('.btn--send-email').textContent =
      'Get password reset link ';
  });
}

// Reset user password form
if (resetPassword) {
  resetPassword.addEventListener('submit', async e => {
    e.preventDefault();

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const token = document.getElementById('resetToken').value;

    await resetPass(password, confirmPassword, token);
  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    const tourId = e.target.dataset.tourId;
    bookTour(tourId);
  });
}
