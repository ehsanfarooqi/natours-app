import '@babel/polyfill';

import { login, logout } from './login';
import { displayMap } from './mapBox';
import { signUp } from './signup';
import { updateSettings } from './updateSettings';

// DOM ELEMENT
const mapBox = document.getElementById('map');
const loadForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const loadSignUpForm = document.querySelector('.form--signup');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-settings');

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
  loadSignUpForm.addEventListener('submit', async e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const photo = document.getElementById('photo').files[0].name;

    signUp(name, email, password, confirmPassword, photo);
  });
}

if (userDataForm) {
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    document.querySelector('.btn--save--settings').textContent = 'Updating...';

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    updateSettings(name, email);

    document.querySelector('.btn--save--settings').textContent =
      'Save settings';
  });
}
