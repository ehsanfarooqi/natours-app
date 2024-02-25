import '@babel/polyfill';

import { login, logout } from './login';
import { displayMap } from './mapBox';
import { signUp } from './signup';

// DOM ELEMENT
const mapBox = document.getElementById('map');
const loadForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const loadSignUpForm = document.querySelector('.form--signup');

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loadForm) {
  loadForm.addEventListener('submit', e => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
}

if (logoutBtn) logoutBtn.addEventListener('click', logout);

if (loadSignUpForm) {
  loadSignUpForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    signUp(name, email, password, confirmPassword);
  });
}
