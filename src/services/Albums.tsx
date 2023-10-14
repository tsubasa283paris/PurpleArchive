import axios from 'axios';

import {
  blobToBase64,
  dateToISOStringWithTZ,
  getApiUrl,
} from '../functionalities/Utils';
import { authHeader } from '../functionalities/AuthContext';
import { Tag } from './Tags';

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

export interface GetAlbumResp {
  id: number;
  source: string;
  thumbSource: string;
  pvCount: number;
  downloadCount: number;
  bookmarkCount: number;
  pageCount: number;
  isBookmarked: boolean;
  playedAt: string;
  contributorUserId: string;
  gamemodeId: number;
  tags: Tag[];
  pageMetaData: PageMetaData[];
  created_at: string;
  updated_at: string;
}

export const getAlbum = (albumId: number, incrementPv: boolean = false) => {
  return axios.get<GetAlbumResp>(getApiUrl(`/albums/${albumId}`), {
    headers: authHeader(),
    params: { incrementPv: incrementPv },
  });
};

export const updateAlbum = (
  albumId: number,
  gamemodeId: number,
  tagIds: number[],
  pageMetaData: PageMetaData[]
) => {
  return axios.put<GetAlbumResp>(
    getApiUrl(`/albums/${albumId}`),
    {
      gamemodeId: gamemodeId,
      tagIds: tagIds,
      pageMetaData: pageMetaData,
    },
    {
      headers: authHeader(),
    }
  );
};

export const uploadAlbum = (
  temporaryAlbumUuid: string,
  gamemodeId: number,
  tagIds: number[],
  playedAt: Date,
  pageMetaData: PageMetaData[]
) => {
  return axios.post<GetAlbumResp>(
    getApiUrl('/albums'),
    {
      temporaryAlbumUuid: temporaryAlbumUuid,
      gamemodeId: gamemodeId,
      tagIds: tagIds,
      playedAt: dateToISOStringWithTZ(playedAt),
      pageMetaData: pageMetaData,
    },
    {
      headers: authHeader(),
    }
  );
};

export const getAlbumRaw = (albumId: number) => {
  return axios.get<Blob>(getApiUrl(`/albums/${albumId}/raw`), {
    headers: authHeader(),
    responseType: 'blob',
  });
};
