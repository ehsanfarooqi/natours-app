import axios from 'axios';
import { showAlert } from './alert';

export const editUserData = async (data, userId) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/users/${userId}`,
      data,
    });
  } catch (err) {
    console.log(err.response.data);
  }
};
