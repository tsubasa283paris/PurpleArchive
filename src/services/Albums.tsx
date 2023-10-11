import axios from 'axios';

import { blobToBase64, getApiUrl } from '../functionalities/Utils';
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

export const bookmarkOne = (albumId: number) => {
  return axios.post<any>(
    getApiUrl('/users/me/bookmarks'),
    {
      albumIds: [albumId],
    },
    {
      headers: authHeader(),
    }
  );
};

export const unBookmarkOne = (albumId: number) => {
  return axios.post<any>(
    getApiUrl('/users/me/bookmarks/unbookmark'),
    {
      albumIds: [albumId],
    },
    {
      headers: authHeader(),
    }
  );
};

export const incrementDlCount = (albumId: number) => {
  return axios.post<any>(
    getApiUrl(`/albums/${albumId}/dlcount`),
    {},
    {
      headers: authHeader(),
    }
  );
};

export interface PageMetaData {
  description: string;
  playerName: string;
}

export interface UploadTempAlbumResp {
  temporaryAlbumUuid: string;
  hashMatchResult: number | null;
  pageMetaData: PageMetaData[];
}

export const uploadTempAlbum = (tempAlbum: File) => {
  return blobToBase64(tempAlbum).then((b64) => {
    console.log(b64);
    return axios.post<UploadTempAlbumResp>(
      getApiUrl('/albums/temp'),
      {
        data: b64,
      },
      {
        headers: authHeader(),
      }
    );
  });
};
