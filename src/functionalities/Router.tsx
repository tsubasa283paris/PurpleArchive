import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import TopPage from '../pages/TopPage';
import LoginPage from '../pages/Login';
import { useAuthInfo } from './AuthContext';
import { AppBar } from '../components/AppBar';
import { Drawer } from '../components/Drawer';

const Router: React.FC = () => {
  const authInfo = useAuthInfo();

  const [openDrawer, setOpenDrawer] = React.useState<boolean>(false);

  const handleJumpBrowse = () => {
    window.location.href = '/';
    console.log('jump to browse');
  };

  const handleJumpMyPage = () => {
    console.log('jump to my page');
  };

  return authInfo === null ? (
    <LoginPage />
  ) : (
    <React.Fragment>
      <AppBar
        open={openDrawer}
        onClickOpenDrawer={() => {
          setOpenDrawer(true);
        }}
      />
      <Drawer
        open={openDrawer}
        onClickCloseDrawer={() => {
          setOpenDrawer(false);
        }}
        onClickJumpBrowse={handleJumpBrowse}
        onClickJumpMyPage={handleJumpMyPage}
      />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<TopPage />} />
        </Routes>
      </BrowserRouter>
    </React.Fragment>
  );
};

export default Router;
