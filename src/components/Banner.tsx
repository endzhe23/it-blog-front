'use client';
import { Paper, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import React from 'react';

import { DefaultImage } from '@/components/DefaultImage';

type BannerProps = {
  readonly bannerData: {
    welcome: string;
    subWelcome: string;
  };
};

const Banner = ({ bannerData: { welcome, subWelcome } }: BannerProps) => {
  return (
    <Paper
      sx={{
        position: 'relative',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '20px',
        color: '#fff',
        textAlign: 'center',
        borderRadius: '8px',
        marginBottom: '20px',
        width: '100%',
        height: '400px',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
      variant='outlined'
    >
      <DefaultImage
        src='/images/banner.png'
        alt='Banner Background'
        position='absolute'
        top={0}
        left={0}
        zIndex={0}
      />
      <Grid
        container
        spacing={2}
        alignItems='center'
        sx={{ position: 'relative', zIndex: 1 }}
      >
        <Grid size={{ xs: 12, md: 3 }}>
          <Typography variant='h4' component='h1' gutterBottom>
            {welcome}
          </Typography>
          <Typography variant='body1' gutterBottom>
            {subWelcome}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 9 }}>
          <Grid container spacing={2}>
            {Array.from({ length: 4 }).map((_, index) => (
              <Grid size={{ xs: 6 }} key={index}>
                <Box
                  sx={{
                    width: '400px',
                    height: '140px',
                    borderRadius: '4px',
                    display: 'flex',
                    backgroundColor: '#ffffff',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: '1px solid #ddd',
                  }}
                >
                  <Typography variant='h6' color='textSecondary' />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Banner;
