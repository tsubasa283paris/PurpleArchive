import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import {
  Alert,
  Box,
  Card,
  CircularProgress,
  Container,
  Snackbar,
} from '@mui/material';
import { AuthContext, Login } from '../functionalities/AuthContext';
import { ARS } from '../functionalities/ApiResponseStatus';
import { mediaQuery, useMediaQuery } from '../functionalities/MediaQuery';

const LoginPage: React.FC<{}> = () => {
  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [isLoginInProgress, setIsLoginInProgress] =
    React.useState<boolean>(false);
  const [isLoginError, setIsLoginError] = React.useState<boolean>(false);
  const [loginErrorDetailsText, setLoginErrorDetailsText] =
    React.useState<string>('');
  const [openSnackbar, setOpenSnackbar] = React.useState<boolean>(false);

  const setAuthInfo = React.useContext(AuthContext).setAuthInfo;

  // responsive
  const isSp = useMediaQuery(mediaQuery.sp);

  const stopProgressBecauseOfError = (text: string) => {
    setIsLoginInProgress(false);
    setLoginErrorDetailsText(text);
    setIsLoginError(true);
    setOpenSnackbar(true);
  };

  const handleSubmitLogin = () => {
    setIsLoginInProgress(true);
    setIsLoginError(false);

    if (username === '' || password === '') {
      stopProgressBecauseOfError('ユーザ名とパスワードを入力してください。');
      return;
    }

    Login(username, password, setAuthInfo).then((status) => {
      setIsLoginInProgress(false);
      setIsLoginError(false);

      switch (status) {
        case ARS.ErrUnauthorized:
          stopProgressBecauseOfError(
            'ユーザ名またはパスワードが誤っています。'
          );
          break;
        case ARS.ErrServerSide:
          stopProgressBecauseOfError('サーバエラーが発生しました。');
          break;
        case ARS.ErrRequest:
          stopProgressBecauseOfError('サーバエラーが発生しました。');
          break;
        default:
          break;
      }
    });
  };

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };

  React.useEffect(() => {
    if (localStorage.getItem('authToken') === 'expired') {
      setLoginErrorDetailsText(
        'セッション期限が切れました。再ログインしてください。'
      );
      setOpenSnackbar(true);
    }
  }, []);

  return (
    <Container>
      <Card
        sx={{
          width: isSp ? '20em' : '30em',
          padding: '3em',
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: '3em',
          marginBottom: '3em',
        }}
      >
        <Box
          component='img'
          sx={{
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            maxHeight: '7em',
            pointerEvents: 'none',
          }}
          alt='Purple Archive icon'
          src='/logo192.png'
        />
        <TextField
          fullWidth
          id='username'
          type='text'
          label='ユーザ名'
          placeholder='Username'
          margin='normal'
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmitLogin();
            }
          }}
          disabled={isLoginInProgress}
          error={isLoginError}
        />
        <TextField
          fullWidth
          id='password'
          type='password'
          label='パスワード'
          placeholder='Password'
          margin='normal'
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmitLogin();
            }
          }}
          disabled={isLoginInProgress}
          error={isLoginError}
        />
        <Button
          fullWidth
          variant='contained'
          size='large'
          color='primary'
          onClick={() => {
            handleSubmitLogin();
          }}
          disabled={isLoginInProgress}
          sx={{
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: '1em',
            marginBottom: '1em',
          }}
        >
          {isLoginInProgress ? <CircularProgress size='1.5em' /> : 'ログイン'}
        </Button>
      </Card>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity='error'
          sx={{ width: '100%' }}
        >
          {loginErrorDetailsText}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LoginPage;
