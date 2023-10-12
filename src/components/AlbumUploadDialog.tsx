import * as React from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { useTheme } from '@mui/material/styles';
import {
  Alert,
  Box,
  Card,
  CircularProgress,
  Divider,
  FormControl,
  MenuItem,
  Select,
  Slide,
  Snackbar,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';

import { PageMetaData, uploadAlbum, uploadTempAlbum } from '../services/Albums';
import { LogoutExpired, useSetAuthInfo } from '../functionalities/AuthContext';
import { Gamemode, getGamemodes } from '../services/Gamemodes';
import { gpNameToDate } from '../functionalities/Utils';

const transitionLength = 800;

interface ConfirmTempAlbumProceedDialogProps {
  open: boolean;
  onClose: (confirm: boolean) => void;
}

const ConfirmTempAlbumProceedDialog = (
  props: ConfirmTempAlbumProceedDialogProps
) => {
  const { open, onClose } = props;
  return (
    <Dialog
      onClose={() => {
        onClose(false);
      }}
      open={open}
    >
      <Box sx={{ width: 360 }}>
        <Typography sx={{ m: '1em' }}>
          同じデータのアルバムがすでに存在します。
        </Typography>
        <Box sx={{ display: 'flex', m: '1em', justifyContent: 'center' }}>
          <Button
            variant='outlined'
            onClick={() => {
              onClose(false);
            }}
            sx={{ width: '50%' }}
          >
            閉じる
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export interface AlbumUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onSaveClose: () => void;
}

const AlbumUploadDialog = (props: AlbumUploadDialogProps) => {
  const { open, onClose, onSaveClose } = props;
  const [activeStep, setActiveStep] = React.useState<0 | 1>(0);
  const [displayStep1, setDisplayStep1] = React.useState<boolean>(true);
  const [tempAlbumFile, setTempAlbumFile] = React.useState<File | null>(null);
  const [tempAlbumPath, setTempAlbumPath] = React.useState<string | null>(null);
  const [isTempAlbumUploading, setIsTempAlbumUploading] =
    React.useState<boolean>(false);
  const [isAlbumUploading, setIsAlbumUploading] =
    React.useState<boolean>(false);
  const [gamemodeList, setGamemodeList] = React.useState<Gamemode[]>([]);
  const [openConfirmDialog, setOpenConfirmDialog] =
    React.useState<boolean>(false);
  const [upAlbumUuid, setUpAlbumUuid] = React.useState<string>('');
  const [upAlbumPages, setUpAlbumPages] = React.useState<PageMetaData[]>([]);
  const [upAlbumGamemodeId, setUpAlbumGameId] = React.useState<number>(0);
  const [upAlbumPlayedAt, setUpAlbumPlayedAt] = React.useState<Date | null>(
    null
  );

  const [openErrorSnackbar, setOpenErrorSnackbar] =
    React.useState<boolean>(false);
  const [errorSnackBarText, setErrorSnackBarText] = React.useState<string>('');

  const theme = useTheme();

  const setAuthInfo = useSetAuthInfo();

  const handleSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      setOpenErrorSnackbar(true);
      setErrorSnackBarText('ファイルの読み込みに失敗しました。');
      setTempAlbumFile(null);
      return;
    }
    const fileName = files[0].name;
    if (fileName.split('.').at(-1) !== 'gif') {
      setOpenErrorSnackbar(true);
      setErrorSnackBarText('GIFファイルのみが対象です。');
      setTempAlbumFile(null);
      return;
    }
    const fileDate = gpNameToDate(fileName);
    if (fileDate === null) {
      setOpenErrorSnackbar(true);
      setErrorSnackBarText(
        'ファイル名が有効な日付・時刻の形式ではありません。'
      );
      setTempAlbumFile(null);
      return;
    }
    setUpAlbumPlayedAt(fileDate);
    setTempAlbumFile(files[0]);
  };

  const handleUploadTempAlbum = () => {
    setIsTempAlbumUploading(true);
    uploadTempAlbum(tempAlbumFile!)
      .then((respTempAlbum) => {
        getGamemodes().then((respGamemodes) => {
          const tempAlbumResult = respTempAlbum.data;
          setGamemodeList(respGamemodes.data.gamemodes);
          setUpAlbumGameId(respGamemodes.data.gamemodes[0].id);
          setUpAlbumUuid(tempAlbumResult.temporaryAlbumUuid);
          setUpAlbumPages(tempAlbumResult.pageMetaData);
          if (tempAlbumResult.hashMatchResult) {
            setOpenConfirmDialog(true);
            return;
          }
          proceedUploadTempAlbum();
        });
      })
      .catch((error) => {
        console.log(error);
        setIsTempAlbumUploading(false);
        if (error.response && error.response.status === 401) {
          LogoutExpired(setAuthInfo);
        } else if (error.response && error.response.status === 400) {
          setOpenErrorSnackbar(true);
          setErrorSnackBarText(
            'ファイル内容が有効なGIFアニメーションではありません。'
          );
        }
      });
  };

  const proceedUploadTempAlbum = () => {
    setIsTempAlbumUploading(false);
    setDisplayStep1(false);
    new Promise((r) => setTimeout(r, transitionLength)).then(() => {
      setActiveStep(1);
    });
  };

  const handleClose = () => {
    onClose();
  };

  const handleUpdateUpAlbumPageMetaData = (
    pageId: number,
    desc: string,
    player: string
  ) => {
    let tempPages: PageMetaData[] = [];
    upAlbumPages.forEach((page, i) => {
      if (i === pageId) {
        page.description = desc;
        page.playerName = player;
      }
      tempPages.push(page);
    });
    setUpAlbumPages(tempPages);
  };

  const handleUpload = () => {
    setIsAlbumUploading(true);
    uploadAlbum(
      upAlbumUuid,
      upAlbumGamemodeId,
      [],
      upAlbumPlayedAt!,
      upAlbumPages
    )
      .then((response) => {
        setIsAlbumUploading(false);
        onSaveClose();
      })
      .catch((error) => {
        console.log(error);
        setIsAlbumUploading(false);
        if (error.response && error.response.status === 401) {
          LogoutExpired(setAuthInfo);
        } else {
          setOpenErrorSnackbar(true);
          setErrorSnackBarText('サーバエラーが発生しました。');
          onSaveClose();
        }
      });
  };

  const handleCloseConfirmDialog = (confirm: boolean) => {
    if (confirm) {
      proceedUploadTempAlbum();
    } else {
      setIsTempAlbumUploading(false);
    }
    setOpenConfirmDialog(false);
  };

  const handleCloseErrorSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenErrorSnackbar(false);
  };

  React.useEffect(() => {
    if (!tempAlbumFile) {
      setTempAlbumPath(null);
      return;
    }

    const objectUrl = URL.createObjectURL(tempAlbumFile);
    setTempAlbumPath(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [tempAlbumFile]);

  React.useEffect(() => {
    if (open) {
      setActiveStep(0);
      setDisplayStep1(true);
      setTempAlbumFile(null);
      setTempAlbumPath(null);
      setIsTempAlbumUploading(false);
      setIsAlbumUploading(false);
      setOpenErrorSnackbar(false);
    }
  }, [open]);

  return (
    <React.Fragment>
      <Dialog onClose={handleClose} open={open} maxWidth={'md'} fullWidth>
        <DialogTitle sx={{ display: 'flex' }}>
          <UploadIcon sx={{ width: 30, height: 30, my: 'auto' }} />
          <Box sx={{ width: 15 }} />
          アップロード
        </DialogTitle>
        <Divider />
        <Box sx={{ m: '1em' }}>
          <Stepper activeStep={activeStep} sx={{ width: 520, mx: 'auto' }}>
            {['ファイル選択', '各種設定'].map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        <Box>
          <Slide
            appear={false}
            direction='right'
            in={displayStep1}
            easing={{ exit: theme.transitions.easing.easeIn }}
            timeout={{ exit: transitionLength }}
            mountOnEnter
            unmountOnExit
          >
            <Box>
              <Box sx={{ display: 'flex', height: 360 }}>
                <Box sx={{ my: 'auto', p: '3em', width: '40%', flexGrow: 1 }}>
                  {tempAlbumPath && (
                    <img
                      src={tempAlbumPath}
                      alt='uploaded album'
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                  )}
                </Box>
                <Divider orientation='vertical' />
                <Box
                  sx={{
                    my: 'auto',
                    p: '2em',
                    width: '60%',
                    flexGrow: 1,
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Button
                    component='label'
                    variant='outlined'
                    startIcon={<UploadIcon />}
                  >
                    クリックしてアップロード…
                    <input type='file' hidden onChange={handleSelectFile} />
                  </Button>
                </Box>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  m: '1em',
                }}
              >
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{ flexGrow: 1, maxWidth: '70%', display: 'flex' }}>
                  <Button
                    onClick={handleClose}
                    variant='outlined'
                    sx={{ flexGrow: 1, width: '47%' }}
                  >
                    キャンセル
                  </Button>
                  <Box sx={{ width: '6%' }} />
                  <Button
                    onClick={handleUploadTempAlbum}
                    variant='contained'
                    disabled={isTempAlbumUploading || tempAlbumFile === null}
                    sx={{ flexGrow: 1, width: '47%' }}
                  >
                    {isTempAlbumUploading ? (
                      <CircularProgress size='1.5em' sx={{ mt: '0.2em' }} />
                    ) : (
                      '次へ'
                    )}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Slide>
          {activeStep === 1 && (
            <Slide
              direction='left'
              in={activeStep === 1}
              easing={{ enter: theme.transitions.easing.easeIn }}
              timeout={{ enter: transitionLength }}
              unmountOnExit
            >
              <Box>
                <Box sx={{ display: 'flex', height: 360 }}>
                  <Box
                    sx={{ my: 'auto', px: '3em', width: '40%', flexGrow: 1 }}
                  >
                    {tempAlbumPath && (
                      <img
                        src={tempAlbumPath}
                        alt='uploaded album'
                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                      />
                    )}
                  </Box>
                  <Divider orientation='vertical' />
                  <Box
                    sx={{
                      my: 'auto',
                      px: '2em',
                      width: '60%',
                      height: '100%',
                      flexGrow: 1,
                    }}
                  >
                    <Box
                      sx={{
                        height: '70%',
                        py: '1em',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <Typography>お題・プレイヤー名</Typography>
                      <Box
                        sx={{
                          flexGrow: 1,
                          overflowY: 'scroll',
                        }}
                      >
                        {upAlbumPages.map((page, i) => (
                          <Card
                            variant='outlined'
                            sx={{ m: '1em', p: '0.5em' }}
                          >
                            <Typography variant='body2'>
                              {'Page ' + String(i + 1)}
                            </Typography>
                            <TextField
                              label='お題'
                              placeholder='（なし）'
                              value={page.description}
                              onChange={(event) => {
                                handleUpdateUpAlbumPageMetaData(
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
                                handleUpdateUpAlbumPageMetaData(
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
                    <Divider />
                    <Box sx={{ height: '30%', py: '1em' }}>
                      <Typography>ゲームモード</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <FormControl size='small' sx={{ width: 320 }}>
                          <Select
                            value={upAlbumGamemodeId}
                            onChange={(event) => {
                              setUpAlbumGameId(Number(event.target.value));
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
                    </Box>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    m: '1em',
                  }}
                >
                  <Box sx={{ flexGrow: 1 }} />
                  <Box sx={{ flexGrow: 1, maxWidth: '70%', display: 'flex' }}>
                    <Button
                      onClick={handleClose}
                      variant='outlined'
                      sx={{ flexGrow: 1, width: '47%' }}
                    >
                      キャンセル
                    </Button>
                    <Box sx={{ width: '6%' }} />
                    <Button
                      onClick={handleUpload}
                      variant='contained'
                      disabled={isAlbumUploading}
                      sx={{ flexGrow: 1, width: '47%' }}
                    >
                      {isAlbumUploading ? (
                        <CircularProgress size='1.5em' sx={{ mt: '0.2em' }} />
                      ) : (
                        '保存'
                      )}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Slide>
          )}
        </Box>
        <ConfirmTempAlbumProceedDialog
          open={openConfirmDialog}
          onClose={handleCloseConfirmDialog}
        />
      </Dialog>
      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseErrorSnackbar}
      >
        <Alert
          onClose={handleCloseErrorSnackbar}
          severity='error'
          sx={{ width: '100%' }}
        >
          {errorSnackBarText}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default AlbumUploadDialog;
