import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import Router from './functionalities/Router';
import defaultTheme from './functionalities/Theme';
import { AuthProvider } from './functionalities/AuthContext';

const App: React.FC = () => {
  return (
    <React.Fragment>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        {/* <NavBar /> */}
        <AuthProvider>
          <Router />
        </AuthProvider>
      </ThemeProvider>
    </React.Fragment>
  );
};

export default App;
