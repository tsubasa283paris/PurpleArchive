import axios from 'axios';

import { getApiUrl } from '../functionalities/Utils';

export const login = (username: string, password: string) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);
  return axios
    .post(
      getApiUrl('/auth'),
      {
        username: username,
        password: password,
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response;
    });
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) return JSON.parse(userStr);

  return null;
};

export default function authHeader() {
  const userStr = localStorage.getItem('user');
  let user = null;
  if (userStr) user = JSON.parse(userStr);

  if (user && user.accessToken) {
    return { Authorization: 'Bearer ' + user.accessToken };
  } else {
    return { Authorization: '' };
  }
}
