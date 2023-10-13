import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import StarIcon from '@mui/icons-material/Star';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { formatPlayedAt } from '../functionalities/Utils';
import { BootstrapTooltip } from './Tooltip';

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
        }}
        image={props.thumbSource}
      />
      <CardContent
        sx={{
          padding: '0.5em',
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'column',
        }}
      >
        <Typography variant='body1'>
          {formatPlayedAt(new Date(props.playedAt))}
        </Typography>
        <Box sx={{ height: '0.3em' }} />
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ display: 'flex', flexGrow: 1 }}>
            <VisibilityIcon
              fontSize='small'
              sx={{ mt: '0.1em', flexGrow: 1 }}
            />
            <Typography variant='body1' sx={{ flexGrow: 3 }}>
              {String(props.pvCount)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexGrow: 1 }}>
            <StarIcon fontSize='small' sx={{ mt: '0.1em', flexGrow: 1 }} />
            <Typography variant='body1' sx={{ flexGrow: 3 }}>
              {String(props.bookmarkCount)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexGrow: 1 }}>
            <DownloadIcon fontSize='small' sx={{ mt: '0.1em', flexGrow: 1 }} />
            <Typography variant='body1' sx={{ flexGrow: 3 }}>
              {String(props.downloadCount)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
      <CardActions
        sx={{ display: 'flex', borderTop: 1, borderColor: 'grey.300' }}
      >
        <BootstrapTooltip
          title={
            props.isBookmarked ? 'ブックマークを解除' : 'ブックマークに追加'
          }
        >
          <Button
            size='small'
            aria-label='add to bookmark'
            onClick={() => {
              props.handlePressBookmark(props.albumId, props.isBookmarked);
            }}
            sx={{ flexGrow: 1 }}
          >
            {props.isBookmarked ? <StarIcon /> : <StarBorderOutlinedIcon />}
          </Button>
        </BootstrapTooltip>
        <BootstrapTooltip title='ダウンロード'>
          <Button
            size='small'
            aria-label='download'
            onClick={() => {
              props.handlePressDownload(props.albumId);
            }}
            sx={{ flexGrow: 1 }}
          >
            <DownloadIcon />
          </Button>
        </BootstrapTooltip>
      </CardActions>
    </Card>
  );
};
