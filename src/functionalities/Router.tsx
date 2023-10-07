import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import TopPage from '../pages/TopPage';
import LoginPage from '../pages/Login';

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<TopPage />} />
        <Route path='/login' element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
