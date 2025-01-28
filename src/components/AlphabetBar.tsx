import React from 'react';
import { Box, Typography } from '@mui/material';

type AlphabetBarProps = {
  onClick: (letter: string) => void;
};

const AlphabetBar = ({ onClick }: AlphabetBarProps) => {
  const characters = [
    'あ',
    'か',
    'さ',
    'た',
    'な',
    'は',
    'ま',
    'や',
    'ら',
    'わ',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh',
        position: 'sticky',
        top: 0,
        right: 0,
        bgcolor: 'white',
        padding: 2,
        borderRadius: 2,
      }}
    >
      {characters.map((char) => (
        <Typography
          key={char}
          variant="h5"
          onClick={() => onClick(char)}
          sx={{
            cursor: 'pointer',
            padding: '4px',
            '&:hover': { fontWeight: 'bold', color: 'secondary.main' },
          }}
        >
          {char}
        </Typography>
      ))}
    </Box>
  );
};
export default AlphabetBar;
