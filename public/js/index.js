import '@babel/polyfill';
import { updateSettings } from '/account';
import { login } from './login';
import { logout } from './login';
import { displayMap } from './mapbox';
import { bookTour } from './stripe';
import { showAlert } from './alert';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const saveSettingsForm = document.querySelector('.form-user-data');
const updatePasswordForm = document.querySelector('.form-user-settings');
const bookBtn = document.getElementById('book-tour');

// DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}
if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (bookBtn)
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const tourId = e.target.dataset.tourId;
    bookTour(tourId);
  });

if (updatePasswordForm) {
  updatePasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    document.querySelector('.btn--save-password').textContent = 'UPDATING...';
    const password = document.getElementById('password-current').value;
    const newPassword = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { password, newPassword, passwordConfirm },
      'password'
    );
    document.querySelector('.btn--save-password').textContent = 'SAVE PASSWORD';
  });
}

if (saveSettingsForm) {
  saveSettingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    updateSettings(form, 'data');
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 20);
