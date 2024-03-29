import axios from 'axios';

import { showAlert } from './alert';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/users/login',
      data: {
        email,
        password,
      },
    });

    window.setTimeout(() => {
      showAlert('success', 'Logged in successfull!');
      location.assign('/');
    }, 1500);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/users/logout',
    });
    if (res.data.status === 'success') location.reload(true);
  } catch (err) {
    showAlert('error', 'Pleas try again to logout!');
  }
};
