import axios from 'axios';
import { showAlert } from './alert';

export const editUserData = async (data, id) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/users/${id}`,
      data,
    });
    console.log(res);
  } catch (err) {
    console.log(err.response.data);
  }
};
