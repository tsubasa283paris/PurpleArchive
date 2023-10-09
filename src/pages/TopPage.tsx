import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {
  Button,
  CircularProgress,
  Divider,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Toolbar,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import UploadIcon from '@mui/icons-material/Upload';

import {
  LogoutExpired,
  useAuthInfo,
  useSetAuthInfo,
} from '../functionalities/AuthContext';
import { AlbumOutlines, getAlbums } from '../services/Albums';
import { ARS } from '../functionalities/ApiResponseStatus';
import { AlbumCard } from '../components/AlbumCard';
import { drawerWidth } from '../components/Drawer';

interface SortMode {
  orderBy:
    | 'playedAt'
    | 'pvCount'
    | 'downloadCount'
    | 'bookmarkCount'
    | 'pageCount';
  order: 'asc' | 'desc';
}

interface SortModeWithDisplayText {
  sortMode: SortMode;
  displayText: string;
}

const sortModeList: SortModeWithDisplayText[] = [
  {
    sortMode: { orderBy: 'playedAt', order: 'desc' },
    displayText: '日付が新しい順',
  },
  {
    sortMode: { orderBy: 'playedAt', order: 'asc' },
    displayText: '日付が古い順',
  },
  {
    sortMode: { orderBy: 'pvCount', order: 'desc' },
    displayText: '表示回数が多い順',
  },
  {
    sortMode: { orderBy: 'pvCount', order: 'asc' },
    displayText: '表示回数が少ない順',
  },
  {
    sortMode: { orderBy: 'bookmarkCount', order: 'desc' },
    displayText: 'ブックマーク数が多い順',
  },
  {
    sortMode: { orderBy: 'bookmarkCount', order: 'asc' },
    displayText: 'ブックマーク数が少ない順',
  },
  {
    sortMode: { orderBy: 'downloadCount', order: 'desc' },
    displayText: 'ダウンロード回数が多い順',
  },
  {
    sortMode: { orderBy: 'downloadCount', order: 'asc' },
    displayText: 'ダウンロード回数が少ない順',
  },
  {
    sortMode: { orderBy: 'pageCount', order: 'desc' },
    displayText: 'ページ数が多い順',
  },
  {
    sortMode: { orderBy: 'pageCount', order: 'asc' },
    displayText: 'ページ数が少ない順',
  },
];

const TopPage: React.FC = () => {
  const [albums, setAlbums] = React.useState<AlbumOutlines[]>([]);
  const [albumsTotalCount, setAlbumsTotalCount] = React.useState<number>(0);
  const [isAlbumsLoading, setIsAlbumLoading] = React.useState<boolean>(false);
  const [sortModeIndex, setSortModeIndex] = React.useState<number>(0);

  const authInfo = useAuthInfo();
  const setAuthInfo = useSetAuthInfo();

  const handleSelectSortMode = (event: SelectChangeEvent) => {
    const sortModeIndex = Number(event.target.value);
    setSortModeIndex(sortModeIndex);
    loadAlbums(sortModeIndex);
  };

  const loadAlbums = (sortModeIndex: number) => {
    const sortMode = sortModeList[sortModeIndex].sortMode;
    setIsAlbumLoading(true);
    return getAlbums({
      orderBy: sortMode.orderBy,
      order: sortMode.order,
    })
      .then((response) => {
        // update albums
        setAlbums(response.data.albums);
        setAlbumsTotalCount(response.data.albumsCountAll);
        console.log('successfully fetched and updated albums');
        setIsAlbumLoading(false);
        return ARS.Ok;
      })
      .catch((error) => {
        console.log(error);
        setIsAlbumLoading(false);
        if (error.response.status === 401) {
          LogoutExpired(setAuthInfo);
        }
        return ARS.ErrServerSide;
      });
  };

  React.useEffect(() => {
    loadAlbums(0);
  }, []);

  return (
    <React.Fragment>
      <main>
        <Container sx={{ maxWidth: `calc(100% - ${drawerWidth}px)` }}>
          <Toolbar />
          <Box sx={{ display: 'flex', py: '1em', height: 80 }}>
            <Box sx={{ width: '40%', display: 'flex' }}>
              <IconButton sx={{ width: 40, height: 40, my: 'auto' }}>
                <FilterListIcon />
              </IconButton>
              <Typography sx={{ my: 'auto' }}>フィルター</Typography>
            </Box>
            <Box sx={{ width: '60%', display: 'flex' }}>
              <FormControl sx={{ width: '50%' }}>
                <Select
                  value={String(sortModeIndex)}
                  onChange={handleSelectSortMode}
                  sx={{ height: '100%' }}
                >
                  {sortModeList.map((sortMode, i) => (
                    <MenuItem value={String(i)}>
                      {sortMode.displayText}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ width: '5%' }} />
              <Button variant='contained' sx={{ width: '45%' }}>
                <UploadIcon color='inherit' />
                アップロード
              </Button>
            </Box>
          </Box>
          <Divider />
          {isAlbumsLoading ? (
            <Box sx={{ display: 'grid', placeItems: 'center', height: '50vh' }}>
              <CircularProgress size={'4em'} />
            </Box>
          ) : (
            <Grid container spacing={4} sx={{ py: '1em' }}>
              {albums.map((album) => (
                <Grid item key={album.thumbSource} xs={12} sm={6} md={4}>
                  <AlbumCard
                    thumbSource={album.thumbSource}
                    playedAt={album.playedAt}
                    pvCount={album.pvCount}
                    bookmarkCount={album.bookmarkCount}
                    downloadCount={album.downloadCount}
                    isBookmarked={album.isBookmarked}
                    handlePressBookmark={undefined}
                    handlePressDownload={undefined}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
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
        <Typography
          variant='subtitle1'
          align='center'
          color='text.secondary'
          component='p'
        >
          {'Fetched: ' + String(albumsTotalCount) + ' albums'}
        </Typography>
      </Box>
      {/* End footer */}
    </React.Fragment>
  );
};

export default TopPage;
