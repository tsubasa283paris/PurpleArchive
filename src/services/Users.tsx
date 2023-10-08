import axios from 'axios';

import { getApiUrl } from '../functionalities/Utils';
import { authHeader } from '../functionalities/AuthContext';

export interface GetUserMeResp {
  id: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
}

export const getUserMe = () => {
  return axios.get<GetUserMeResp>(getApiUrl('/users/me'), {
    headers: authHeader(),
  });
};
