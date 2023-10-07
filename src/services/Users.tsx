import axios from 'axios';

import authHeader from './Auth';
import { getApiUrl } from '../functionalities/Utils';

interface UserInfo {
  id: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
}

export const getUserMe = () => {
  return axios.get<UserInfo>(getApiUrl('/users/me'), { headers: authHeader() });
};
