import React from 'react';
import { Box, CircularProgress, Toolbar } from '@mui/material';
import { useParams } from 'react-router-dom';
import { GetAlbumResp, getAlbum } from '../services/Albums';
import NotFoundPage from './404';
import { LogoutExpired, useSetAuthInfo } from '../functionalities/AuthContext';

const AlbumPage: React.FC = () => {
  const { id } = useParams<string>();
  const albumId = Number(id);
  const [isAlbumLoading, setIsAlbumLoading] = React.useState<boolean>(true);
  const [album, setAlbum] = React.useState<GetAlbumResp | null>(null);

  const setAuthInfo = useSetAuthInfo();

  const loadAlbum = () => {
    setIsAlbumLoading(true);
    getAlbum(albumId, true)
      .then((response) => {
        setAlbum(response.data);
        setIsAlbumLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsAlbumLoading(false);
        if (error.response && error.response.status === 401) {
          LogoutExpired(setAuthInfo);
        } else if (error.response && error.response.status === 404) {
          setAlbum(null);
        }
      });
  };

  React.useEffect(() => {
    // first, try to parse id
    if (isNaN(albumId)) {
      setAlbum(null);
    } else {
      // then check if album exists
      loadAlbum();
    }
  }, []);

  return isAlbumLoading ? (
    <Box sx={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
      <CircularProgress size={'4em'} />
    </Box>
  ) : album === null ? (
    <NotFoundPage />
  ) : (
    <main>
      <Toolbar />
      {album.playedAt}
    </main>
  );
};

export default AlbumPage;
