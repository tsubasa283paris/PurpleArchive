import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const MyPage = () => {
  return (
    <React.Fragment>
      <Box sx={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
        <Typography variant='h3'>工事中</Typography>
      </Box>
    </React.Fragment>
  );
};

export default MyPage;
