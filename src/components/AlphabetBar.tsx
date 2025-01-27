import React from 'react';
import { Box, Typography } from '@mui/material';

type AlphabetBarProps = {
  onClick: (letter: string) => void;
};

const AlphabetBar = ({ onClick }: AlphabetBarProps) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        overflowY: 'auto',
      }}
    >
      {alphabet.map((letter) => (
        <Typography
          key={letter}
          variant="body1"
          onClick={() => onClick(letter)}
          sx={{
            cursor: 'pointer',
            padding: '4px',
            '&:hover': { fontWeight: 'bold', color: 'primary.main' },
          }}
        >
          {letter}
        </Typography>
      ))}
    </Box>
  );
};

export default AlphabetBar;
