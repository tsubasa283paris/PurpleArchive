import FileUploadIcon from '@mui/icons-material/FileUpload';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

export default function NavBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='relative'>
        <Toolbar sx={{ textAlign: 'center' }}>
          <div>
            <Tooltip title='Upload'>
              <IconButton
                size='large'
                aria-label='upload GIF file to this project'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                color='inherit'
              >
                <FileUploadIcon />
              </IconButton>
            </Tooltip>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
