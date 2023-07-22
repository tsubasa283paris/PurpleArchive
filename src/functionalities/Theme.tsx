import { pink, purple } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

const defaultTheme = createTheme({
  palette: {
    primary: purple,
    secondary: pink,
  },
});

export default defaultTheme;
