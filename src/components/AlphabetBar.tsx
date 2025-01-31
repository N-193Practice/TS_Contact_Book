import React from 'react';
import { Box, Typography } from '@mui/material';
import styles from './AlphabetBar.module.css';

// AlphabetBarProps という名前の型を定義する
type AlphabetBarProps = {
  onClick: (letter: string) => void;
};

// AlphabetBarProps 型の引数を受け取る AlphabetBar コンポーネントを定義する
const AlphabetBar = ({ onClick }: AlphabetBarProps) => {
  const characters = [
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
    '#',
  ];

  return (
    <Box className={styles.alphabetContainer}>
      {/* characters 配列の各要素を表示する */}
      {characters.map((char) => (
        <Typography
          key={char}
          variant="h5"
          onClick={() => onClick(char)}
          className={styles.alphabetButton}
        >
          {char}
        </Typography>
      ))}
    </Box>
  );
};

export default AlphabetBar;
