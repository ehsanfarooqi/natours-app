import axios from 'axios';
import { showAlert } from './alert';

export const addNewUser = async data => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/users/create-user',
      data,
    });
    window.setTimeout(() => {
      showAlert('success', 'User successfully created.');
      location.assign('/me');
    }, 1500);
  } catch (err) {
    showAlert('error', err.response.data.mesage);
  }
};
