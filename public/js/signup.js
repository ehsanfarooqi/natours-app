import axios from 'axios';

import { showAlert } from './alert';

export const signUp = async (name, email, password, confirmPassword) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/users/signup',
      data: {
        name,
        email,
        password,
        confirmPassword,
      },
    });

    window.setTimeout(() => {
      showAlert('success', 'Sign up successfull!');
      location.assign('/');
    }, 1500);
  } catch (err) {
    showAlert('errorr', err.reponse.data.message);
  }
};
