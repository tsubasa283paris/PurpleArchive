import React from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Dialog,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import StarIcon from '@mui/icons-material/Star';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

import NotFoundPage from './404';
import { LogoutExpired, useSetAuthInfo } from '../functionalities/AuthContext';
import {
  GetAlbumResp,
  PageMetaData,
  bookmarkOne,
  getAlbum,
  getAlbumRaw,
  incrementDlCount,
  unBookmarkOne,
  updateAlbum,
} from '../services/Albums';
import { drawerWidth } from '../components/Drawer';
import { dateToGpName, formatPlayedAt } from '../functionalities/Utils';
import { BootstrapTooltip } from '../components/Tooltip';
import { Gamemode, getGamemodes } from '../services/Gamemodes';
import { ARS } from '../functionalities/ApiResponseStatus';
import { Tag, getTags, uploadTag } from '../services/Tags';
import { useDebounce } from 'react-use';

const AlbumPage: React.FC = () => {
  const { id } = useParams<string>();
  const albumId = Number(id);
  const [isAlbumLoading, setIsAlbumLoading] = React.useState<boolean>(true);
  const [album, setAlbum] = React.useState<GetAlbumResp | null>(null);
  const [gamemodeList, setGamemodeList] = React.useState<Gamemode[]>([]);
  const [isAlbumUpdateLoading, setIsAlbumUpdateLoading] =
    React.useState<boolean>(false);
  const [openAlbumSaveSnackbar, setOpenAlbumSaveSnackbar] =
    React.useState<boolean>(false);
  const [openAddTagDialog, setOpenAddTagDialog] =
    React.useState<boolean>(false);
  const [addTag, setAddTag] = React.useState<string>('');
  const [isSuggestTagsLoading, setIsSuggestTagsLoading] =
    React.useState<boolean>(false);
  const [suggestTags, setSuggestTags] = React.useState<Tag[]>([]);
  const [preventSuggestTags, setPreventSuggestTags] =
    React.useState<boolean>(false);
  const [isTagSaveLoading, setIsTagSaveLoading] =
    React.useState<boolean>(false);

  const setAuthInfo = useSetAuthInfo();

  const navigate = useNavigate();

  const handleCloseAlbumSaveSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAlbumSaveSnackbar(false);
  };

  const handlePressBookmark = () => {
    const p = album!.isBookmarked
      ? unBookmarkOne(albumId)
      : bookmarkOne(albumId);
    p.then(() => {
      let tempAlbum: GetAlbumResp = { ...album! };
      tempAlbum.bookmarkCount += album!.isBookmarked ? -1 : 1;
      tempAlbum.isBookmarked = !album!.isBookmarked;
      setAlbum(tempAlbum);
    }).catch((error) => {
      console.log(error);
      if (error.response && error.response.status === 401) {
        LogoutExpired(setAuthInfo);
      }
    });
  };

  const handlePressDownload = () => {
    incrementDlCount(album!.id)
      .then(() => {
        let tempAlbum: GetAlbumResp = { ...album! };
        let fileName: string = '';
        // give album file redirect API
        fileName = dateToGpName(new Date(tempAlbum.playedAt));
        // update download count
        tempAlbum.downloadCount += 1;
        setAlbum(tempAlbum);
        getAlbumRaw(album!.id)
          .then((response) => {
            // make album downloaded
            const href = URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.setAttribute('href', href);
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();

            // cleanup
            document.body.removeChild(link);
            URL.revokeObjectURL(href);
          })
          .catch((error) => {
            console.log(error);
            if (error.response && error.response.status === 401) {
              LogoutExpired(setAuthInfo);
            }
          });
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          LogoutExpired(setAuthInfo);
        }
      });
  };

  const handleUpdateAlbumGamemodeId = (gamemodeId: number) => {
    let tempAlbum: GetAlbumResp = { ...album! };
    tempAlbum.gamemodeId = gamemodeId;
    setAlbum(tempAlbum);
    applyUpdateAlbum(tempAlbum);
  };

  const handleUpdateAlbumPageMetaData = (
    pageId: number,
    desc: string,
    player: string
  ) => {
    let tempAlbum: GetAlbumResp = { ...album! };
    let tempPages: PageMetaData[] = [];
    album!.pageMetaData.forEach((page, i) => {
      if (i === pageId) {
        page.description = desc;
        page.playerName = player;
      }
      tempPages.push(page);
    });
    tempAlbum.pageMetaData = tempPages;
    setAlbum(tempAlbum);
  };

  const handleSaveAlbumPageMetaData = () => {
    applyUpdateAlbum(album!);
  };

  const handleClickExistingTag = (tagName: string) => {
    // jump to albums page with tag filter
    localStorage.setItem('albumsFilterPD', '');
    localStorage.setItem('albumsFilterPP', '');
    localStorage.setItem('albumsFilterPF', '');
    localStorage.setItem('albumsFilterPU', '');
    localStorage.setItem('albumsFilterGI', '');
    localStorage.setItem('albumsFilterPT', tagName);
    navigate('/albums', { replace: true });
  };

  const handleDeleteExistingTag = (tagId: number) => {
    let tempAlbum: GetAlbumResp = { ...album! };
    let tempTags: Tag[] = [];
    album!.tags.forEach((tag) => {
      if (tag.id !== tagId) {
        tempTags.push(tag);
      }
    });
    tempAlbum.tags = tempTags;
    setAlbum(tempAlbum);
    applyUpdateAlbum(tempAlbum);
  };

  const handleInputAddTag = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPreventSuggestTags(false);
    setAddTag(event.target.value);
    if (event.target.value.length > 0) {
      setIsSuggestTagsLoading(true);
    }
  };

  const handleSaveAddTag = () => {
    let tempAlbum: GetAlbumResp = { ...album! };
    let tempTags: Tag[] = tempAlbum.tags;
    let pushTag: Tag | null = null;
    setIsTagSaveLoading(true);
    uploadTag(addTag)
      .then((response) => {
        pushTag = response.data;
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          LogoutExpired(setAuthInfo);
        } else if (error.response && error.response.status === 409) {
          pushTag = error.response.data;
        }
      })
      .then(() => {
        setIsTagSaveLoading(false);
        if (pushTag) {
          setOpenAddTagDialog(false);
          tempTags.push(pushTag);
          tempAlbum.tags = tempTags;
          setAlbum(tempAlbum);
          applyUpdateAlbum(tempAlbum);
        }
      });
  };

  const isAddTagAlreadyExist = () => {
    let result = false;
    album!.tags.forEach((tag) => {
      if (addTag === tag.name) {
        result = true;
      }
    });
    return result;
  };

  useDebounce(
    () => {
      if (addTag.length === 0 || preventSuggestTags) {
        setIsSuggestTagsLoading(false);
        return;
      }
      getTags({ partialName: addTag, limit: 5 })
        .then((response) => {
          setSuggestTags(response.data.tags);
          setIsSuggestTagsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setIsSuggestTagsLoading(false);
          if (error.response && error.response.status === 401) {
            LogoutExpired(setAuthInfo);
          }
        });
    },
    700,
    [addTag]
  );

  const loadAlbum = () => {
    setIsAlbumLoading(true);
    return getAlbum(albumId, true)
      .then((response) => {
        setAlbum(response.data);
        return ARS.Ok;
      })
      .catch((error) => {
        console.log(error);
        setIsAlbumLoading(false);
        if (error.response && error.response.status === 401) {
          LogoutExpired(setAuthInfo);
        } else if (error.response && error.response.status === 404) {
          setAlbum(null);
        }
        return ARS.ErrServerSide;
      });
  };

  const loadGamemodes = () => {
    return getGamemodes()
      .then((response) => {
        setGamemodeList(response.data.gamemodes);
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

  const applyUpdateAlbum = (album_: GetAlbumResp) => {
    setIsAlbumUpdateLoading(true);
    let tagIds: number[] = [];
    album_.tags.forEach((tag) => {
      tagIds.push(tag.id);
    });
    updateAlbum(album_.id, album_.gamemodeId, tagIds, album_.pageMetaData)
      .then((response) => {
        setIsAlbumUpdateLoading(false);
        setOpenAlbumSaveSnackbar(true);
      })
      .catch((error) => {
        console.log(error);
        setIsAlbumUpdateLoading(false);
        if (error.response && error.response.status === 401) {
          LogoutExpired(setAuthInfo);
        }
      });
  };

  React.useEffect(() => {
    // first, try to parse id
    if (isNaN(albumId)) {
      setIsAlbumLoading(false);
      setAlbum(null);
    } else {
      // then check if album exists
      loadAlbum().then((status) => {
        if (status === ARS.Ok) {
          // ...and load gamemodes
          loadGamemodes();
        }
      });
    }
  }, []);

  return (
    <React.Fragment>
      <main>
        <Container
          maxWidth='lg'
          sx={{ width: `calc(100% - ${drawerWidth}px)` }}
        >
          <Toolbar />
          {isAlbumLoading ? (
            <Box
              sx={{ display: 'grid', placeItems: 'center', height: '100vh' }}
            >
              <CircularProgress size={'4em'} />
            </Box>
          ) : album === null ? (
            <NotFoundPage />
          ) : (
            <React.Fragment>
              <Box sx={{ display: 'flex', p: '0.3em' }}>
                <Button
                  onClick={() => {
                    navigate('/albums', { replace: true });
                  }}
                  sx={{ height: 30, my: 'auto', color: 'grey' }}
                >
                  <ChevronLeftIcon fontSize='small' />
                  <Typography fontSize='small'>アルバム一覧</Typography>
                </Button>
              </Box>
              <Box sx={{ display: 'flex', mb: '0.6em' }}>
                <Box sx={{ flexGrow: 1, width: '50%' }}>
                  <Typography variant='h5'>
                    {formatPlayedAt(new Date(album.playedAt))}
                  </Typography>
                </Box>
                <Box sx={{ flexGrow: 1, width: '50%', display: 'flex' }}>
                  <Button
                    size='small'
                    variant='outlined'
                    onClick={handlePressBookmark}
                    sx={{ flexGrow: 1, mx: '0.5em' }}
                  >
                    {album.isBookmarked ? (
                      <StarIcon />
                    ) : (
                      <StarBorderOutlinedIcon />
                    )}
                    ブックマーク
                  </Button>
                  <Button
                    size='small'
                    variant='outlined'
                    onClick={handlePressDownload}
                    sx={{ flexGrow: 1, mx: '0.5em' }}
                  >
                    <DownloadIcon />
                    ダウンロード
                  </Button>
                </Box>
              </Box>
              <Divider />
              <Box
                sx={{
                  my: '0.6em',
                  display: 'flex',
                  height: 'calc(100vh - 200px)',
                }}
              >
                <Box
                  sx={{
                    flexGrow: 1,
                    width: '50%',
                    height: '100%',
                    pr: '0.3em',
                    overflowY: 'auto',
                  }}
                >
                  <Box
                    component='img'
                    src={album.source}
                    alt='album animation'
                    style={{
                      display: 'block',
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'scale-down',
                      pointerEvents: 'none',
                      marginBottom: '0.2em',
                    }}
                  />
                  <Box
                    sx={{
                      mx: '2em',
                      my: '0.2em',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <BootstrapTooltip title='表示回数'>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <VisibilityIcon
                          fontSize='medium'
                          sx={{ mr: '0.2em', flexGrow: 1 }}
                        />
                        <Typography variant='h6' sx={{ flexGrow: 3 }}>
                          {String(album.pvCount)}
                        </Typography>
                      </Box>
                    </BootstrapTooltip>
                    <BootstrapTooltip title='ブックマーク数'>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <StarIcon
                          fontSize='medium'
                          sx={{ mr: '0.2em', flexGrow: 1 }}
                        />
                        <Typography variant='h6' sx={{ flexGrow: 3 }}>
                          {String(album.bookmarkCount)}
                        </Typography>
                      </Box>
                    </BootstrapTooltip>
                    <BootstrapTooltip title='ダウンロード回数'>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DownloadIcon
                          fontSize='medium'
                          sx={{ mr: '0.2em', flexGrow: 1 }}
                        />
                        <Typography variant='h6' sx={{ flexGrow: 3 }}>
                          {String(album.downloadCount)}
                        </Typography>
                      </Box>
                    </BootstrapTooltip>
                  </Box>
                  <Box
                    sx={{
                      my: '0.2em',
                    }}
                  >
                    <Typography variant='subtitle1'>ゲームモード</Typography>
                    <Box
                      sx={{
                        mx: '2em',
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      <FormControl
                        size='small'
                        sx={{ width: '100%', maxWidth: 320 }}
                      >
                        <Select
                          value={album.gamemodeId}
                          fullWidth
                          onChange={(event) => {
                            handleUpdateAlbumGamemodeId(
                              Number(event.target.value)
                            );
                          }}
                        >
                          {gamemodeList.map((gamemode, i) => (
                            <MenuItem
                              value={gamemode.id}
                              key={String(gamemode.id)}
                            >
                              {gamemode.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                    <Box
                      sx={{
                        my: '0.2em',
                        width: '100%',
                      }}
                    >
                      <Typography variant='subtitle1'>タグ</Typography>
                      <Box
                        sx={{
                          mx: '2em',
                          display: 'flex',
                          flexWrap: 'wrap',
                        }}
                      >
                        {album.tags.map((tag) => (
                          <Box
                            key={tag.name}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mr: '0.4em',
                            }}
                          >
                            <Button
                              variant='contained'
                              size='small'
                              onClick={() => {
                                handleClickExistingTag(tag.name);
                              }}
                              sx={{
                                borderRadius: 100,
                                m: '0.1em',
                                textTransform: 'none',
                              }}
                            >
                              {tag.name}
                            </Button>
                            <IconButton
                              size='small'
                              onClick={() => {
                                handleDeleteExistingTag(tag.id);
                              }}
                            >
                              <CloseIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>
                      <Box sx={{ my: '0.3em', float: 'right' }}>
                        {album.tags.length < 10 && (
                          <Button
                            variant='contained'
                            size='small'
                            sx={{ display: 'flex', alignItems: 'center' }}
                            onClick={() => {
                              setOpenAddTagDialog(true);
                            }}
                          >
                            <AddIcon sx={{ fontSize: 16 }} />
                            タグを追加…
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box
                  sx={{
                    flexGrow: 1,
                    width: '50%',
                    height: '100%',
                    pl: '0.6em',
                  }}
                >
                  <Box
                    sx={{
                      height: 40,
                      display: 'flex',
                      justifyContent: 'space-between',
                      pb: '0.6em',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant='subtitle1'>ページ情報</Typography>
                    </Box>
                    <Button
                      size='small'
                      variant='contained'
                      onClick={handleSaveAlbumPageMetaData}
                    >
                      {isAlbumUpdateLoading ? (
                        <CircularProgress
                          size='1.5em'
                          sx={{ color: 'white' }}
                        />
                      ) : (
                        '保存'
                      )}
                    </Button>
                  </Box>
                  <Box
                    sx={{
                      height: 'calc(100% - 40px)',
                      overflowY: 'scroll',
                    }}
                  >
                    {album.pageMetaData.map((page, i) => (
                      <Card
                        variant='outlined'
                        key={i}
                        sx={{
                          m: '1em',
                          mt: i === 0 ? 0 : '1em',
                          mb: i === album.pageMetaData.length - 1 ? 0 : '1em',
                          p: '0.5em',
                        }}
                      >
                        <Typography variant='body2'>
                          {'Page ' + String(i + 1)}
                        </Typography>
                        <TextField
                          label='お題'
                          placeholder='（なし）'
                          value={page.description}
                          onChange={(event) => {
                            handleUpdateAlbumPageMetaData(
                              i,
                              event.target.value,
                              page.playerName
                            );
                          }}
                          size='small'
                          fullWidth
                          sx={{ my: '0.7em' }}
                        />
                        <TextField
                          label='プレイヤー名'
                          placeholder='（なし）'
                          value={page.playerName}
                          onChange={(event) => {
                            handleUpdateAlbumPageMetaData(
                              i,
                              page.description,
                              event.target.value
                            );
                          }}
                          size='small'
                          fullWidth
                        />
                      </Card>
                    ))}
                  </Box>
                </Box>
              </Box>
            </React.Fragment>
          )}
        </Container>
      </main>
      <Snackbar
        open={openAlbumSaveSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseAlbumSaveSnackbar}
      >
        <Alert
          onClose={handleCloseAlbumSaveSnackbar}
          severity='success'
          sx={{ width: '100%' }}
        >
          アルバム情報を保存しました。
        </Alert>
      </Snackbar>
      <Dialog onClose={() => {}} open={openAddTagDialog}>
        <DialogTitle>タグ追加</DialogTitle>
        <Divider />
        <Box sx={{ m: '1em', px: '2em', width: 320 }}>
          <TextField
            type='search'
            fullWidth
            size='small'
            value={addTag}
            onChange={handleInputAddTag}
          />
          <Box sx={{ mt: '0.5em' }}>
            {isSuggestTagsLoading ? (
              <CircularProgress size={'1em'} />
            ) : (
              addTag.length > 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                  }}
                >
                  {suggestTags.map((tag) => (
                    <Button
                      variant='contained'
                      size='small'
                      onClick={() => {
                        setAddTag(tag.name);
                        setSuggestTags([]);
                        setPreventSuggestTags(true);
                      }}
                      key={tag.name}
                      sx={{
                        borderRadius: 100,
                        m: '0.1em',
                        textTransform: 'none',
                      }}
                    >
                      {tag.name}
                    </Button>
                  ))}
                </Box>
              )
            )}
          </Box>
        </Box>
        <Box
          sx={{
            m: '1em',
            ml: 'auto',
            mr: '1em',
          }}
        >
          <Box sx={{ width: 270, display: 'flex' }}>
            <Button
              onClick={() => {
                setOpenAddTagDialog(false);
              }}
              variant='outlined'
              fullWidth
              sx={{ flexGrow: 1, width: '47%' }}
            >
              キャンセル
            </Button>
            <Box sx={{ width: '6%' }} />
            <Box sx={{ flexGrow: 1, width: '47%' }}>
              <Button
                variant='contained'
                fullWidth
                onClick={handleSaveAddTag}
                disabled={addTag.length === 0 || isAddTagAlreadyExist()}
              >
                {isTagSaveLoading ? <CircularProgress size='1.5em' /> : '保存'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Dialog>
    </React.Fragment>
  );
};

export default AlbumPage;
