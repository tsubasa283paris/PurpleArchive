import MuiDrawer from '@mui/material/Drawer';
import { Box, IconButton } from '@mui/material';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';

export const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: 240,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const DrawerProxy = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

interface DrawerProps {
  open: boolean;
  onClickCloseDrawer: () => void;
  onClickJumpBrowse: () => void;
  onClickJumpMyPage: () => void;
}

export const Drawer = (props: DrawerProps) => {
  const theme = useTheme();

  return (
    <DrawerProxy variant='permanent' open={props.open}>
      <DrawerHeader>
        <Box sx={{ width: '100%', textAlign: 'center', paddingTop: '0.3em' }}>
          <img src='logo192.png' height='40em' />
        </Box>
        <IconButton onClick={props.onClickCloseDrawer}>
          {theme.direction === 'rtl' ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        <ListItem key='Browse' disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: props.open ? 'initial' : 'center',
              px: 2.5,
            }}
            onClick={props.onClickJumpBrowse}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: props.open ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
              <SearchIcon />
            </ListItemIcon>
            <ListItemText
              primary={'Browse'}
              sx={{ opacity: props.open ? 1 : 0 }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem key='My Page' disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: props.open ? 'initial' : 'center',
              px: 2.5,
            }}
            onClick={props.onClickJumpMyPage}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: props.open ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
              <PersonIcon />
            </ListItemIcon>
            <ListItemText
              primary={'My Page'}
              sx={{ opacity: props.open ? 1 : 0 }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </DrawerProxy>
  );
};
