import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import {
  Alert,
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  FormControl,
  Paper,
  Snackbar,
} from '@mui/material';
import { login } from '../services/Auth';

const LoginPage: React.FC = () => {
  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [isLoginInProgress, setIsLoginInProgress] =
    React.useState<boolean>(false);
  const [isLoginError, setIsLoginError] = React.useState<boolean>(false);
  const [loginErrorDetailsText, setLoginErrorDetailsText] =
    React.useState<string>('');
  const [openSnackbar, setOpenSnackbar] = React.useState<boolean>(false);

  const handleSubmitLogin = () => {
    setIsLoginInProgress(true);
    setIsLoginError(false);

    if (username === '' || password === '') {
      setIsLoginInProgress(false);
      setLoginErrorDetailsText('ユーザ名とパスワードを入力してください。');
      setIsLoginError(true);
      setOpenSnackbar(true);
      return;
    }

    login(username, password)
      .then((response) => {
        console.log(response);
        setIsLoginInProgress(false);
        setIsLoginError(false);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.status, error.response.data);
          if (error.response.status === 401) {
            setIsLoginInProgress(false);
            setLoginErrorDetailsText(
              'ユーザ名またはパスワードが誤っています。'
            );
            setIsLoginError(true);
            setOpenSnackbar(true);
            return;
          }
        } else if (error.request) {
          console.log(error.request);
          setIsLoginInProgress(false);
          setLoginErrorDetailsText('サーバエラーが発生しました。');
          setIsLoginError(true);
          setOpenSnackbar(true);
        } else {
          console.log('Error', error.message);
          setIsLoginInProgress(false);
          setLoginErrorDetailsText('サーバエラーが発生しました。');
          setIsLoginError(true);
          setOpenSnackbar(true);
        }
        // console.log(error.config);
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

  return (
    <Container>
      <Card
        sx={{
          width: '30em',
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
