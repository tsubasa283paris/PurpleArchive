import FileUploadIcon from '@mui/icons-material/FileUpload';
import MenuIcon from '@mui/icons-material/Menu';
import MoreIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';

export function NavBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='fixed' color='primary' sx={{ top: 0, bottom: '93%' }}>
        <Toolbar>
          <Tooltip title='Open Menu'>
            <IconButton size='large' color='inherit' aria-label='open drawer'>
              <MenuIcon />
            </IconButton>
          </Tooltip>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title='Upload'>
            <IconButton size='large' color='inherit' aria-label='upload'>
              <FileUploadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Search Menu'>
            <IconButton size='large' color='inherit' aria-label='search'>
              <SearchIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='More'>
            <IconButton size='large' color='inherit' aria-label='more'>
              <MoreIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
