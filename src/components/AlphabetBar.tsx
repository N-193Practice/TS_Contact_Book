import React from 'react';
import { Box, Typography } from '@mui/material';

// AlphabetBarProps という名前の型を定義する
type AlphabetBarProps = {
  onClick: (letter: string) => void;
};

// AlphabetBarProps 型の引数を受け取る AlphabetBar コンポーネントを定義する
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
        '@media (max-width: 600px)': {
          position: 'sticky',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          height: 'auto',
          padding: 1,
        },
      }}
    >
      {/* characters 配列の各要素を表示する */}
      {characters.map((char) => (
        <Typography
          key={char}
          variant="h5"
          onClick={() => onClick(char)}
          sx={{
            cursor: 'pointer',
            padding: '4px',
            '&:hover': { fontWeight: 'bold', color: 'secondary.main' },
            '@media (max-width: 600px)': {
              fontSize: '0.75rem',
              padding: '2px',
            },
          }}
        >
          {char}
        </Typography>
      ))}
    </Box>
  );
};
export default AlphabetBar;
