import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Typography,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import StarIcon from '@mui/icons-material/Star';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { formatPlayedAt } from '../functionalities/Utils';
import { AlbumOutlines } from '../services/Albums';
import React from 'react';

interface AlbumCardProps {
  thumbSource: string;
  playedAt: string;
  pvCount: number;
  bookmarkCount: number;
  downloadCount: number;
  isBookmarked: boolean;
  handlePressBookmark: any;
  handlePressDownload: any;
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
        <Typography variant='h6'>
          {formatPlayedAt(new Date(props.playedAt))}
        </Typography>
        <Box sx={{ height: '0.3em' }} />
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ display: 'flex', flexGrow: 1 }}>
            <VisibilityIcon sx={{ flexGrow: 1 }} />
            <Typography sx={{ flexGrow: 3 }}>
              {String(props.pvCount)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexGrow: 1 }}>
            <StarIcon sx={{ flexGrow: 1 }} />
            <Typography sx={{ flexGrow: 3 }}>
              {String(props.bookmarkCount)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexGrow: 1 }}>
            <DownloadIcon sx={{ flexGrow: 1 }} />
            <Typography sx={{ flexGrow: 3 }}>
              {String(props.downloadCount)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
      <CardActions
        sx={{ display: 'flex', borderTop: 1, borderColor: 'grey.300' }}
      >
        <Button size='medium' sx={{ flexGrow: 1 }}>
          {props.isBookmarked ? <StarIcon /> : <StarBorderOutlinedIcon />}
        </Button>
        <Button size='medium' sx={{ flexGrow: 1 }}>
          <DownloadIcon />
        </Button>
      </CardActions>
    </Card>
  );
};
