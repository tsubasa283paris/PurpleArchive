import axios from 'axios';

import { getApiUrl } from '../functionalities/Utils';
import { authHeader } from '../functionalities/AuthContext';

export interface Gamemode {
  id: number;
  name: string;
}

export interface GetGamemodesResp {
  gamemodesCountAll: number;
  gamemodes: Gamemode[];
}

export const getGamemodes = () => {
  return axios.get<GetGamemodesResp>(getApiUrl('/gamemodes'), {
    headers: authHeader(),
  });
};
