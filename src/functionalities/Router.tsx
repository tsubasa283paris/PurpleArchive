import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import TopPage from '../pages/TopPage';
import LoginPage from '../pages/Login';
import { useAuthInfo } from './AuthContext';

const Router: React.FC = () => {
  const authInfo = useAuthInfo();
  return authInfo === null ? (
    <LoginPage />
  ) : (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<TopPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
