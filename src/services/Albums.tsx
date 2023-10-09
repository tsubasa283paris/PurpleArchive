import axios from 'axios';

import { getApiUrl } from '../functionalities/Utils';
import { authHeader } from '../functionalities/AuthContext';

export interface AlbumOutlines {
  id: number;
  source: string;
  thumbSource: string;
  pvCount: number;
  downloadCount: number;
  bookmarkCount: number;
  pageCount: number;
  isBookmarked: boolean;
  playedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAlbumsResp {
  albumsCountAll: number;
  albums: AlbumOutlines[];
}

export interface GetAlbumsParams {
  partialDescription?: string;
  partialPlayerName?: string;
  playedFrom?: number;
  playedUntil?: number;
  gamemodeId?: number;
  partialTag?: string;
  myBookmark?: boolean;
  offset?: number;
  limit?: number;
  orderBy?: string;
  order?: string;
}

export const getAlbums = (params: GetAlbumsParams) => {
  console.log(params);
  return axios.get<GetAlbumsResp>(getApiUrl('/albums'), {
    headers: authHeader(),
    params: params,
  });
};
