import * as React from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  CircularProgress,
  Divider,
  Slide,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';

import { UploadTempAlbumResp, uploadTempAlbum } from '../services/Albums';

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
  const [uploadedTempAlbum, setUploadedTempAlbum] =
    React.useState<UploadTempAlbumResp | null>(null);
  const [openConfirmDialog, setOpenConfirmDialog] =
    React.useState<boolean>(false);

  const theme = useTheme();

  const handleSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      setTempAlbumFile(null);
      return;
    }
    setTempAlbumFile(files[0]);
  };

  const handleUploadTempAlbum = () => {
    setIsTempAlbumUploading(true);
    uploadTempAlbum(tempAlbumFile!).then((response) => {
      setUploadedTempAlbum(response.data);
      if (response.data.hashMatchResult) {
        setOpenConfirmDialog(true);
        return;
      }
      proceedUploadTempAlbum();
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

  const handleUpload = () => {
    setIsAlbumUploading(true);
    new Promise((r) => setTimeout(r, 2000)).then(() => {
      setIsAlbumUploading(false);
      onSaveClose();
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
    }
  }, [open]);

  return (
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
                <Box sx={{ my: 'auto', px: '3em', width: '40%', flexGrow: 1 }}>
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
  );
};

export default AlbumUploadDialog;
