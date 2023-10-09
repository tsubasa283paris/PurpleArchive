import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import TopPage from '../pages/TopPage';
import MyPage from '../pages/MyPage';
import LoginPage from '../pages/Login';
import { useAuthInfo } from './AuthContext';
import { Bars } from '../components/Bars';

const Router: React.FC = () => {
  const authInfo = useAuthInfo();

  return authInfo === null ? (
    <LoginPage />
  ) : (
    <React.Fragment>
      <BrowserRouter>
        <Routes>
          <Route
            index
            element={
              <React.Fragment>
                <Bars location='top' />
                <TopPage />
              </React.Fragment>
            }
          />
          <Route
            path='/mypage'
            element={
              <React.Fragment>
                <Bars location='mypage' />
                <MyPage />
              </React.Fragment>
            }
          />
        </Routes>
      </BrowserRouter>
    </React.Fragment>
  );
};

export default Router;
