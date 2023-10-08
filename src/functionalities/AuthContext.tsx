import axios from 'axios';
import React, { Dispatch, SetStateAction } from 'react';
import { Box, CircularProgress } from '@mui/material';

import { GetUserMeResp, getUserMe } from '../services/Users';
import { getApiUrl } from '../functionalities/Utils';
import { ARS } from './ApiResponseStatus';

interface AuthInfo {
  authToken: string;
  userInfo: GetUserMeResp;
}

interface AuthInfoState {
  authInfo: AuthInfo | null;
  setAuthInfo: Dispatch<SetStateAction<AuthInfo | null>>;
}

export const AuthContext = React.createContext<AuthInfoState>({
  authInfo: null,
  setAuthInfo: () => undefined,
});

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [authInfo, setAuthInfo] = React.useState<AuthInfo | null>(null);
  const [isUserInfoLoading, setIsUserInfoLoading] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    const authToken = localStorage.getItem('authToken');

    if (authToken === null) {
      return;
    }

    // fetch user data
    setIsUserInfoLoading(true);
    getUserMe()
      .then((response) => {
        // finally store authToken and userInfo then return OK
        setAuthInfo({
          authToken: authToken,
          userInfo: response.data,
        });
        console.log('successfully updated authToken');
        setIsUserInfoLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ authInfo, setAuthInfo }}>
      {isUserInfoLoading ? (
        <Box sx={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
          <CircularProgress size={'5em'} />
        </Box>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuthInfo = () => React.useContext(AuthContext).authInfo;
export const useSetAuthInfo = () => React.useContext(AuthContext).setAuthInfo;

export const Login = (
  username: string,
  password: string,
  setAuthInfo: React.Dispatch<React.SetStateAction<AuthInfo | null>>
) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);
  return axios
    .post(
      getApiUrl('/auth'),
      {
        username: username,
        password: password,
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    .then((response) => {
      const authToken: string | undefined = response.data.accessToken;
      if (authToken) {
        localStorage.setItem('authToken', authToken);

        // fetch user data
        return getUserMe()
          .then((response) => {
            // finally store authToken and userInfo then return OK
            setAuthInfo({
              authToken: authToken,
              userInfo: response.data,
            });
            console.log('successfully updated authToken');
            return ARS.Ok;
          })
          .catch((error) => {
            console.log(error);
            return ARS.ErrServerSide;
          });
      }
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response.status, error.response.data);
        return ARS.ErrUnauthorized;
      } else if (error.request) {
        return ARS.ErrServerSide;
      } else {
        return ARS.ErrRequest;
      }
    });
};

export const Logout = (
  setAuthInfo: React.Dispatch<React.SetStateAction<AuthInfo | null>>
) => {
  localStorage.removeItem('authToken');
  setAuthInfo(null);
};

export const authHeader = () => {
  const authToken = localStorage.getItem('authToken');
  if (authToken) {
    return { Authorization: 'Bearer ' + authToken };
  } else {
    throw Error(
      "undefined state: localStorage doesn't hold authToken while entering API call"
    );
  }
};
