import * as React from 'react';
import { useDebounce } from 'react-use';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {
  Badge,
  Box,
  CircularProgress,
  Divider,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';

import { Gamemode } from '../services/Gamemodes';
import { Tag, getTags } from '../services/Tags';
import { LogoutExpired, useSetAuthInfo } from '../functionalities/AuthContext';

export interface AlbumFilter {
  partialDescription: string | null;
  partialPlayerName: string | null;
  playedFrom: Date | null;
  playedUntil: Date | null;
  gamemodeId: number | null;
  partialTag: string | null;
}

export interface AlbumFilterDialogProps {
  open: boolean;
  gamemodeList: Gamemode[];
  albumFilter: AlbumFilter;
  onClose: () => void;
  onSaveClose: (albumFilter: AlbumFilter) => void;
}

const AlbumFilterDialog = (props: AlbumFilterDialogProps) => {
  const { open, gamemodeList, albumFilter, onClose, onSaveClose } = props;
  const [partialDescription, setPartialDescription] = React.useState<string>(
    albumFilter.partialDescription ?? ''
  );
  const [partialPlayerName, setPartialPlayerName] = React.useState<string>(
    albumFilter.partialPlayerName ?? ''
  );
  const [playedFrom, setPlayedFrom] = React.useState<Date | null>(
    albumFilter.playedFrom
  );
  const [playedUntil, setPlayedUntil] = React.useState<Date | null>(
    albumFilter.playedUntil
  );
  const [gamemodeId, setGamemodeId] = React.useState<number | null>(
    albumFilter.gamemodeId
  );
  const [partialTag, setPartialTag] = React.useState<string>(
    albumFilter.partialTag ?? ''
  );
  const [isSuggestTagsLoading, setIsSuggestTagsLoading] =
    React.useState<boolean>(false);
  const [suggestTags, setSuggestTags] = React.useState<Tag[]>([]);
  const [preventSuggestTags, setPreventSuggestTags] =
    React.useState<boolean>(false);

  const setAuthInfo = useSetAuthInfo();

  const handleClose = () => {
    onClose();
  };

  const handleSaveClose = () => {
    onSaveClose({
      partialDescription: partialDescription.length ? partialDescription : null,
      partialPlayerName: partialPlayerName.length ? partialPlayerName : null,
      playedFrom: playedFrom,
      playedUntil: playedUntil,
      gamemodeId: gamemodeId,
      partialTag: partialTag.length ? partialTag : null,
    });
  };

  const handleInputPartialTag = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPreventSuggestTags(false);
    setPartialTag(event.target.value);
    if (event.target.value.length > 0) {
      setIsSuggestTagsLoading(true);
    }
  };

  useDebounce(
    () => {
      if (partialTag.length === 0 || preventSuggestTags) {
        setIsSuggestTagsLoading(false);
        return;
      }
      getTags({ partialName: partialTag, limit: 5 })
        .then((response) => {
          setSuggestTags(response.data.tags);
          setIsSuggestTagsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setIsSuggestTagsLoading(false);
          if (error.response && error.response.status === 401) {
            LogoutExpired(setAuthInfo);
          }
        });
    },
    700,
    [partialTag]
  );

  React.useEffect(() => {
    setPartialDescription(albumFilter.partialDescription ?? '');
    setPartialPlayerName(albumFilter.partialPlayerName ?? '');
    setPlayedFrom(albumFilter.playedFrom);
    setPlayedUntil(albumFilter.playedUntil);
    setGamemodeId(albumFilter.gamemodeId);
    setPartialTag(albumFilter.partialTag ?? '');
  }, [albumFilter]);

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle sx={{ display: 'flex' }}>
        <Badge
          badgeContent={
            Number(partialDescription.length > 0) +
            Number(partialPlayerName.length > 0) +
            Number(playedFrom !== null || playedUntil !== null) +
            Number(gamemodeId !== null) +
            Number(partialTag.length > 0)
          }
          color='primary'
        >
          <FilterListIcon sx={{ width: 30, height: 30, my: 'auto' }} />
        </Badge>
        <Box sx={{ width: 15 }} />
        フィルタ
      </DialogTitle>
      <Divider />
      <Box sx={{ m: '1em', width: 450 }}>
        <Box sx={{ display: 'flex', my: '0.5em' }}>
          <Box
            sx={{
              flexGrow: 1,
              width: '8%',
              mx: '0.3em',
              my: 'auto',
              textAlign: 'center',
            }}
          >
            {partialDescription && (
              <CheckCircleIcon color='primary' sx={{ marginTop: '0.2em' }} />
            )}
          </Box>
          <Box sx={{ flexGrow: 1, width: '37%', mx: '0.3em', my: 'auto' }}>
            <Typography sx={{}}>お題</Typography>
          </Box>
          <Box sx={{ flexGrow: 1, width: '55%', mx: '0.3em' }}>
            <TextField
              type='search'
              fullWidth
              size='small'
              value={partialDescription}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPartialDescription(event.target.value);
              }}
              sx={{}}
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', my: '0.5em' }}>
          <Box
            sx={{
              flexGrow: 1,
              width: '8%',
              mx: '0.3em',
              my: 'auto',
              textAlign: 'center',
            }}
          >
            {partialPlayerName && (
              <CheckCircleIcon color='primary' sx={{ marginTop: '0.2em' }} />
            )}
          </Box>
          <Box sx={{ flexGrow: 1, width: '37%', mx: '0.3em', my: 'auto' }}>
            <Typography sx={{}}>プレイヤー名</Typography>
          </Box>
          <Box sx={{ flexGrow: 1, width: '55%', mx: '0.3em' }}>
            <TextField
              type='search'
              fullWidth
              size='small'
              value={partialPlayerName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPartialPlayerName(event.target.value);
              }}
              sx={{}}
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', mt: '0.5em', mb: '0.2em' }}>
          <Box
            sx={{
              flexGrow: 1,
              width: '8%',
              mx: '0.3em',
              my: 'auto',
              textAlign: 'center',
            }}
          >
            {(playedFrom !== null || playedUntil !== null) && (
              <CheckCircleIcon color='primary' sx={{ marginTop: '0.2em' }} />
            )}
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              width: '37%',
              mx: '0.3em',
              my: 'auto',
            }}
          >
            <Typography sx={{}}>日付</Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Typography variant='body2' sx={{ my: 'auto' }}>
              from:
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1, width: '55%', mx: '0.3em' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                value={playedFrom && dayjs(playedFrom)}
                onChange={(value: Dayjs | null) => {
                  setPlayedFrom(value ? value.toDate() : null);
                }}
                ampm={false}
                format='YYYY/MM/DD HH:mm:ss'
                slotProps={{
                  textField: { size: 'small' },
                  actionBar: { actions: ['clear'] },
                }}
              />
            </LocalizationProvider>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', mt: '0.2em', mb: '0.5em' }}>
          <Box
            sx={{
              flexGrow: 1,
              width: '8%',
              mx: '0.3em',
              my: 'auto',
              textAlign: 'center',
            }}
          />
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              width: '37%',
              mx: '0.3em',
              my: 'auto',
            }}
          >
            <Box sx={{ flexGrow: 1 }} />
            <Typography variant='body2' sx={{ my: 'auto' }}>
              to:
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1, width: '55%', mx: '0.3em' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                value={playedUntil && dayjs(playedUntil)}
                onChange={(value: Dayjs | null) => {
                  setPlayedUntil(value ? value.toDate() : null);
                }}
                ampm={false}
                format='YYYY/MM/DD HH:mm:ss'
                slotProps={{
                  textField: { size: 'small' },
                  actionBar: { actions: ['clear'] },
                }}
              />
            </LocalizationProvider>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', my: '0.5em' }}>
          <Box
            sx={{
              flexGrow: 1,
              width: '8%',
              mx: '0.3em',
              my: 'auto',
              textAlign: 'center',
            }}
          >
            {gamemodeId !== null && (
              <CheckCircleIcon color='primary' sx={{ marginTop: '0.2em' }} />
            )}
          </Box>
          <Box sx={{ flexGrow: 1, width: '37%', mx: '0.3em', my: 'auto' }}>
            <Typography sx={{}}>ゲームモード</Typography>
          </Box>
          <Box sx={{ flexGrow: 1, width: '55%', mx: '0.3em' }}>
            <FormControl fullWidth size='small'>
              <Select
                value={String(gamemodeId)}
                onChange={(event) => {
                  if (event.target.value === 'null') {
                    setGamemodeId(null);
                  } else {
                    setGamemodeId(Number(event.target.value));
                  }
                }}
              >
                <MenuItem value={'null'} key={'null'}>
                  すべて
                </MenuItem>
                {gamemodeList.map((gamemode, i) => (
                  <MenuItem
                    value={String(gamemode.id)}
                    key={String(gamemode.id)}
                  >
                    {gamemode.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', my: '0.5em' }}>
          <Box
            sx={{
              flexGrow: 1,
              width: '8%',
              mx: '0.3em',
              my: 'auto',
              textAlign: 'center',
            }}
          >
            {partialTag && (
              <CheckCircleIcon color='primary' sx={{ marginTop: '0.2em' }} />
            )}
          </Box>
          <Box sx={{ flexGrow: 1, width: '37%', mx: '0.3em', my: 'auto' }}>
            <Typography sx={{}}>タグ</Typography>
          </Box>
          <Box sx={{ flexGrow: 1, width: '55%', mx: '0.3em' }}>
            <TextField
              type='search'
              fullWidth
              size='small'
              value={partialTag}
              onChange={handleInputPartialTag}
              sx={{}}
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', my: '0.2em' }}>
          <Box sx={{ flexGrow: 1, width: '45%', mx: '0.3em' }} />
          <Box
            sx={{ flexGrow: 1, width: '55%', mx: '0.3em', textAlign: 'center' }}
          >
            {isSuggestTagsLoading ? (
              <CircularProgress size={'1em'} />
            ) : (
              partialTag.length > 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                  }}
                >
                  {suggestTags.map((tag) => (
                    <Button
                      variant='contained'
                      size='small'
                      onClick={() => {
                        setPartialTag(tag.name);
                        setSuggestTags([]);
                        setPreventSuggestTags(true);
                      }}
                      sx={{ borderRadius: 100, m: '0.1em' }}
                    >
                      {tag.name}
                    </Button>
                  ))}
                </Box>
              )
            )}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', my: '0.5em' }}>
          <Box sx={{ flexGrow: 1, width: '60%', mx: '0.3em', my: 'auto' }} />
          <Box sx={{ flexGrow: 1, mx: '0.3em' }}>
            <Button
              variant='outlined'
              onClick={() => {
                setPartialDescription('');
                setPartialPlayerName('');
                setPlayedFrom(null);
                setPlayedUntil(null);
                setGamemodeId(null);
                setPartialTag('');
              }}
              sx={{ width: '100%' }}
            >
              すべてクリア
            </Button>
          </Box>
        </Box>
      </Box>
      <Divider />
      <Box
        sx={{
          display: 'flex',
          m: '1em',
        }}
      >
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ flexGrow: 1, maxWidth: '70%', display: 'flex' }}>
          <Button
            onClick={handleClose}
            variant='outlined'
            sx={{ flexGrow: 1, width: '47%' }}
          >
            キャンセル
          </Button>
          <Box sx={{ width: '6%' }} />
          <Button
            onClick={handleSaveClose}
            variant='contained'
            sx={{ flexGrow: 1, width: '47%' }}
          >
            保存
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default AlbumFilterDialog;
