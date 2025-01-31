import React from 'react';
import { useContacts } from '../contexts/ContactContext';
import { Box, Typography } from '@mui/material';
import styles from './AlphabetBar.module.css';

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

function AlphabetBar() {
  const { handleAlphabetClick } = useContacts();

  return (
    <Box className={styles.alphabetContainer}>
      {characters.map((char) => (
        <Typography
          key={char}
          variant="h5"
          onClick={() => handleAlphabetClick(char)}
          className={styles.alphabetButton}
        >
          {char}
        </Typography>
      ))}
    </Box>
  );
}
export default AlphabetBar;
