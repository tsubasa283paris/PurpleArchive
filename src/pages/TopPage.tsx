import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { formatPlayedAt } from '../functionalities/Utils';
import { useAuthInfo } from '../functionalities/AuthContext';
import { AlbumOutlines, getAlbums } from '../services/Albums';
import { ARS } from '../functionalities/ApiResponseStatus';
import { CircularProgress } from '@mui/material';

const TopPage: React.FC = () => {
  const [albums, setAlbums] = React.useState<AlbumOutlines[]>([]);
  const [albumsTotalCount, setAlbumsTotalCount] = React.useState<number>(0);
  const [isAlbumsLoading, setIsAlbumLoading] = React.useState<boolean>(false);

  const authInfo = useAuthInfo();

  const loadResources = () => {
    return getAlbums({})
      .then((response) => {
        // update albums
        setAlbums(response.data.albums);
        setAlbumsTotalCount(response.data.albumsCountAll);
        console.log('successfully fetched and updated albums');
        return ARS.Ok;
      })
      .catch((error) => {
        console.log(error);
        return ARS.ErrServerSide;
      });
  };

  React.useEffect(() => {
    loadResources().then((status) => {
      setIsAlbumLoading(false);
    });
  }, []);

  return (
    <Container>
      <main>
        {isAlbumsLoading ? (
          <CircularProgress size='1.5em' />
        ) : (
          <Container sx={{ py: 8, paddingTop: '7%' }} maxWidth='md'>
            <Grid container spacing={4}>
              {albums.map((album) => (
                <Grid item key={album.thumbSource} xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <CardMedia
                      component='div'
                      sx={{
                        // 770:525
                        pt: '68.18%',
                      }}
                      image={album.thumbSource}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography component='h2'>
                        {formatPlayedAt(new Date(album.playedAt))}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size='small'>Download</Button>
                      <Button size='small'>Edit</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        )}
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component='footer'>
        <Typography variant='h6' align='center' gutterBottom>
          Purple Archive
        </Typography>
        <Typography
          variant='subtitle1'
          align='center'
          color='text.secondary'
          component='p'
        >
          {'Hello, ' + authInfo?.userInfo.displayName + ' !'}
        </Typography>
      </Box>
      {/* End footer */}
    </Container>
  );
};

export default TopPage;
