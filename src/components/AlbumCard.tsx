import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import StarIcon from '@mui/icons-material/Star';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';

import { formatPlayedAt } from '../functionalities/Utils';
import { BootstrapTooltip } from './Tooltip';
import { mediaQuery, useMediaQuery } from '../functionalities/MediaQuery';

interface AlbumCardProps {
  albumId: number;
  thumbSource: string;
  playedAt: string;
  pvCount: number;
  bookmarkCount: number;
  downloadCount: number;
  isBookmarked: boolean;
  handlePressBookmark: (albumId: number, isBookmarked: boolean) => void;
  handlePressDownload: (albumId: number) => void;
}

export const AlbumCard = (props: AlbumCardProps) => {
  const navigate = useNavigate();

  const theme = useTheme();

  const isSp = useMediaQuery(mediaQuery.sp);
  const fontSizeMain = isSp ? 14 : 16;
  const fontSizeMainIcon = fontSizeMain * 1.2;
  const fontSizeButtonIcon = isSp ? 15 : 20;
  const littlePadding = isSp ? theme.spacing(0.5) : theme.spacing(1);

  const navigateToAlbum = () => {
    navigate(`/albums/${props.albumId}`, { replace: true });
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardMedia
        component='div'
        sx={{
          // 770:525
          pt: '68.18%',
          cursor: 'pointer',
        }}
        image={props.thumbSource}
        onClick={navigateToAlbum}
      />
      <CardContent
        sx={{
          padding: littlePadding,
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'column',
        }}
      >
        <Typography fontSize={fontSizeMain}>
          {formatPlayedAt(new Date(props.playedAt))}
        </Typography>
        <Box sx={{ height: '0.3em' }} />
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ display: 'flex', flexGrow: 1 }}>
            <VisibilityIcon
              sx={{ mt: '0.1em', flexGrow: 1, fontSize: fontSizeMainIcon }}
            />
            <Typography fontSize={fontSizeMain} sx={{ flexGrow: 3 }}>
              {String(props.pvCount)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexGrow: 1 }}>
            <StarIcon
              sx={{ mt: '0.1em', flexGrow: 1, fontSize: fontSizeMainIcon }}
            />
            <Typography fontSize={fontSizeMain} sx={{ flexGrow: 3 }}>
              {String(props.bookmarkCount)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexGrow: 1 }}>
            <DownloadIcon
              sx={{ mt: '0.1em', flexGrow: 1, fontSize: fontSizeMainIcon }}
            />
            <Typography fontSize={fontSizeMain} sx={{ flexGrow: 3 }}>
              {String(props.downloadCount)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
      <CardActions
        sx={{
          display: 'flex',
          borderTop: 1,
          borderColor: 'grey.300',
          padding: littlePadding,
        }}
      >
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <BootstrapTooltip
            title={
              props.isBookmarked ? 'ブックマークを解除' : 'ブックマークに追加'
            }
          >
            <IconButton
              size='small'
              aria-label='add to bookmark'
              color='primary'
              onClick={() => {
                props.handlePressBookmark(props.albumId, props.isBookmarked);
              }}
            >
              {props.isBookmarked ? (
                <StarIcon sx={{ fontSize: fontSizeButtonIcon }} />
              ) : (
                <StarBorderOutlinedIcon sx={{ fontSize: fontSizeButtonIcon }} />
              )}
            </IconButton>
          </BootstrapTooltip>
        </Box>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <BootstrapTooltip title='ダウンロード'>
            <IconButton
              size='small'
              aria-label='download'
              color='primary'
              onClick={() => {
                props.handlePressDownload(props.albumId);
              }}
            >
              <DownloadIcon sx={{ fontSize: fontSizeButtonIcon }} />
            </IconButton>
          </BootstrapTooltip>
        </Box>
      </CardActions>
    </Card>
  );
};
