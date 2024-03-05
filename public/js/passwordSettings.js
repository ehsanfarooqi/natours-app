import axios from 'axios';
import { showAlert } from './alert';

// Fogot password
export const forgotPass = async email => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'api/users/forgotPassword',
      data: {
        email,
      },
    });
    showAlert('success', 'Successfull! Please cheeck your email');
    window.setTimeout(() => {
      location.reload();
    }, 1000);
  } catch (err) {
    showAlert('error', 'Can not find this email. Pleas try again.');
  }
};

// Reset user password
export const resetPass = async (password, confirmPassword, token) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `api/users/resetPassword/${token}`,
      data: {
        password,
        confirmPassword,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Successfully your password reseted 🙂');
      window.setTimeout(() => {
        location.assign('/me');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
