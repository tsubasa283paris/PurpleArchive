import React from 'react';
import { Box, Typography } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';

const NotFoundPage: React.FC<{}> = () => {
  return (
    <main>
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <BlockIcon sx={{ fontSize: 100, color: 'lightgrey' }} />
          <Typography variant='h5' sx={{ color: 'lightgrey' }}>
            このページは存在しません
          </Typography>
        </Box>
      </Box>
    </main>
  );
};

export default NotFoundPage;
