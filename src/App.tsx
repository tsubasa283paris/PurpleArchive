import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import Router from './functionalities/Router';
import { NavBar } from './components/NavBar';
import defaultTheme from './functionalities/Theme';

const App: React.FC = () => {
  return (
    <React.Fragment>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        {/* <NavBar /> */}
        <Router />
      </ThemeProvider>
    </React.Fragment>
  );
};

export default App;
