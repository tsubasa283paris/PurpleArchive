import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { getFileBasename } from '../functionalities/Utils';

const cards = [
  `${process.env.PUBLIC_URL}/mock_gifs/mock_album_1.gif`,
  `${process.env.PUBLIC_URL}/mock_gifs/mock_album_2.gif`,
  `${process.env.PUBLIC_URL}/mock_gifs/mock_album_3.gif`,
  `${process.env.PUBLIC_URL}/mock_gifs/mock_album_4.gif`,
  `${process.env.PUBLIC_URL}/mock_gifs/mock_album_5.gif`,
  `${process.env.PUBLIC_URL}/mock_gifs/mock_album_6.gif`,
  `${process.env.PUBLIC_URL}/mock_gifs/mock_album_7.gif`,
  `${process.env.PUBLIC_URL}/mock_gifs/mock_album_8.gif`,
  `${process.env.PUBLIC_URL}/mock_gifs/mock_album_9.gif`,
  `${process.env.PUBLIC_URL}/mock_gifs/mock_album_10.gif`,
  `${process.env.PUBLIC_URL}/mock_gifs/mock_album_11.gif`,
  `${process.env.PUBLIC_URL}/mock_gifs/mock_album_12.gif`,
];

const HomePage: React.FC = () => {
  return (
    <Container>
      <main>
        <Container sx={{ py: 8, paddingTop: '7%' }} maxWidth='md'>
          <Grid container spacing={4}>
            {cards.map((imgPath) => (
              <Grid item key={imgPath} xs={12} sm={6} md={4}>
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
                    image={imgPath}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography component='h2'>
                      {getFileBasename(imgPath)}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size='small'>Download</Button>
                    <Button size='small'>Edit</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component='footer'>
        <Typography variant='h6' align='center' gutterBottom>
          Purple Archive
        </Typography>
        <Typography
          variant='subtitle1'
          align='center'
          color='text.secondary'
          component='p'
        >
          Say thank you to Alpaca and Saxgumi!
        </Typography>
      </Box>
      {/* End footer */}
    </Container>
  );
};

export default HomePage;
