import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {
  Badge,
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
import {
  AlbumOutlines,
  bookmarkOne,
  getAlbums,
  incrementDlCount,
  unBookmarkOne,
} from '../services/Albums';
import { ARS } from '../functionalities/ApiResponseStatus';
import { AlbumCard } from '../components/AlbumCard';
import { drawerWidth } from '../components/Drawer';
import AlbumFilterDialog, {
  AlbumFilter,
} from '../components/AlbumFilterDialog';
import { Gamemode, getGamemodes } from '../services/Gamemodes';
import { formatDate } from '../functionalities/Utils';

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
  const [openFilterDialog, setOpenFilterDialog] =
    React.useState<boolean>(false);
  const [gamemodeList, setGamemodeList] = React.useState<Gamemode[]>([]);

  // album filters
  const [partialDescription, setPartialDescription] = React.useState<
    string | null
  >(null);
  const [partialPlayerName, setPartialPlayerName] = React.useState<
    string | null
  >(null);
  const [playedFrom, setPlayedFrom] = React.useState<Date | null>(null);
  const [playedUntil, setPlayedUntil] = React.useState<Date | null>(null);
  const [gamemodeId, setGamemodeId] = React.useState<number | null>(null);
  const [partialTag, setPartialTag] = React.useState<string | null>(null);

  const authInfo = useAuthInfo();
  const setAuthInfo = useSetAuthInfo();

  const handleCloseFilterDialog = () => {
    setOpenFilterDialog(false);
  };

  const handleSaveCloseFilterDialog = (albumFilter: AlbumFilter) => {
    setOpenFilterDialog(false);
    setPartialDescription(albumFilter.partialDescription);
    setPartialPlayerName(albumFilter.partialPlayerName);
    setPlayedFrom(albumFilter.playedFrom);
    setPlayedUntil(albumFilter.playedUntil);
    setGamemodeId(albumFilter.gamemodeId);
    setPartialTag(albumFilter.partialTag);
  };

  const handleSelectSortMode = (event: SelectChangeEvent) => {
    const sortModeIndex = Number(event.target.value);
    setSortModeIndex(sortModeIndex);
    loadAlbums(sortModeIndex);
  };

  const handlePressBookmark = (albumId: number, isBookmarked: boolean) => {
    const p = isBookmarked ? unBookmarkOne(albumId) : bookmarkOne(albumId);
    p.then(() => {
      let tempAlbums: AlbumOutlines[] = [];
      albums.forEach((album) => {
        if (album.id === albumId) {
          album.bookmarkCount += isBookmarked ? -1 : 1;
          album.isBookmarked = !isBookmarked;
        }
        tempAlbums.push(album);
      });
      setAlbums(tempAlbums);
    }).catch((error) => {
      console.log(error);
      if (error.response && error.response.status === 401) {
        LogoutExpired(setAuthInfo);
      }
    });
  };

  const handlePressDownload = (albumId: number) => {
    incrementDlCount(albumId)
      .then(() => {
        // find target album
        let fileName: string = '';
        let fileHref: string = '';
        let tempAlbums: AlbumOutlines[] = [];
        albums.forEach((album) => {
          if (album.id === albumId) {
            // store file name and href
            fileName =
              'album_' +
              formatDate(new Date(album.playedAt), 'yyyy-MM-dd_hh-mm-ss') +
              '.gif';
            fileHref = album.source;
            // update download count
            album.downloadCount += 1;
          }
          tempAlbums.push(album);
        });
        setAlbums(tempAlbums);
        // make album downloaded
        const link = document.createElement('a');
        link.setAttribute('href', fileHref);
        link.setAttribute('download', fileName);
        /**
         * @todo this 'download' update does not work. give users
         *       GIF files with datetime in their name!
         */
        link.click();
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          LogoutExpired(setAuthInfo);
        }
      });
  };

  const loadAlbums = (sortModeIndex: number) => {
    const sortMode = sortModeList[sortModeIndex].sortMode;
    setIsAlbumLoading(true);
    return getAlbums({
      orderBy: sortMode.orderBy,
      order: sortMode.order,
      ...(partialDescription && { partialDescription: partialDescription }),
      ...(partialPlayerName && { partialPlayerName: partialPlayerName }),
      ...(playedFrom && { playedFrom: playedFrom.getTime() / 1000 }),
      ...(playedUntil && { playedUntil: playedUntil.getTime() / 1000 }),
      ...(gamemodeId && { gamemodeId: gamemodeId }),
      ...(partialTag && { partialTag: partialTag }),
    })
      .then((response) => {
        // update albums
        if (response.data.albums === undefined) {
          throw Error('empty albums');
        }
        setAlbums(response.data.albums);
        setAlbumsTotalCount(response.data.albumsCountAll);
        console.log('successfully fetched and updated albums');
        setIsAlbumLoading(false);
        return ARS.Ok;
      })
      .catch((error) => {
        console.log(error);
        setIsAlbumLoading(false);
        if (error.response && error.response.status === 401) {
          LogoutExpired(setAuthInfo);
        }
        return ARS.ErrServerSide;
      });
  };

  const loadGamemodes = () => {
    return getGamemodes()
      .then((response) => {
        // update gamemodes
        if (response.data.gamemodes === undefined) {
          throw Error('empty gamemodes');
        }
        setGamemodeList(response.data.gamemodes);
        console.log('successfully fetched and updated gamemodes');
        return ARS.Ok;
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          LogoutExpired(setAuthInfo);
        }
        return ARS.ErrServerSide;
      });
  };

  React.useEffect(() => {
    loadAlbums(sortModeIndex).then(() => {
      loadGamemodes();
    });
  }, [
    partialDescription,
    partialPlayerName,
    playedFrom,
    playedUntil,
    gamemodeId,
    partialTag,
  ]);

  return (
    <React.Fragment>
      <main>
        <Container
          maxWidth='md'
          sx={{ width: `calc(100% - ${drawerWidth}px)` }}
        >
          <Toolbar />
          <Box sx={{ display: 'flex', py: '1em', height: 80 }}>
            <Box sx={{ width: '40%', display: 'flex' }}>
              <IconButton
                onClick={() => {
                  setOpenFilterDialog(true);
                }}
                sx={{ width: 40, height: 40, my: 'auto' }}
              >
                <Badge
                  badgeContent={
                    Number(partialDescription !== null) +
                    Number(partialPlayerName !== null) +
                    Number(playedFrom !== null || playedUntil !== null) +
                    Number(gamemodeId !== null) +
                    Number(partialTag !== null)
                  }
                  color='primary'
                >
                  <FilterListIcon />
                </Badge>
              </IconButton>
              <Typography sx={{ my: 'auto' }}>フィルタ</Typography>
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
                <Grid item key={album.thumbSource} xs={8} sm={4} md={3}>
                  <AlbumCard
                    albumId={album.id}
                    thumbSource={album.thumbSource}
                    playedAt={album.playedAt}
                    pvCount={album.pvCount}
                    bookmarkCount={album.bookmarkCount}
                    downloadCount={album.downloadCount}
                    isBookmarked={album.isBookmarked}
                    handlePressBookmark={handlePressBookmark}
                    handlePressDownload={handlePressDownload}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
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
        <AlbumFilterDialog
          open={openFilterDialog}
          gamemodeList={gamemodeList}
          albumFilter={{
            partialDescription: null,
            partialPlayerName: null,
            playedFrom: null,
            playedUntil: null,
            gamemodeId: null,
            partialTag: null,
          }}
          onClose={handleCloseFilterDialog}
          onSaveClose={handleSaveCloseFilterDialog}
        />
      </main>
    </React.Fragment>
  );
};

export default TopPage;
