import axios from 'axios';

import { getApiUrl } from '../functionalities/Utils';
import { authHeader } from '../functionalities/AuthContext';

export interface Tag {
  id: number;
  name: string;
}

export interface GetTagsResp {
  tagsCountAll: number;
  tags: Tag[];
}

export interface GetTagsParams {
  partialName?: string;
  offset?: number;
  limit?: number;
}

export const getTags = (params: GetTagsParams) => {
  return axios.get<GetTagsResp>(getApiUrl('/tags'), {
    headers: authHeader(),
    params: params,
  });
};
