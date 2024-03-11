import axios from 'axios';
import { showAlert } from './alert';

export const addNewUser = async data => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/users/create-user',
      data,
    });
    console.log(res);
    window.setTimeout(() => {
      location.assign('/manage-users');
    }, 1000);
  } catch (err) {
    console.log(err.response.data);
  }
};
