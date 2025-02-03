import { useContacts } from '../../contexts/useContacts';
import { Box, Typography } from '@mui/material';
import styles from './AlphabetBar.module.css';

// アルファベットバーのボタンの文字列
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

/**
 * `AlphabetBar` コンポーネント
 * 連絡先リストをアルファベットや五十音でフィルタリングするためのナビゲーションバー。
 * `useContacts` フックを利用して、クリックされた文字に基づいてリストをスクロール。
 * @returns {JSX.Element} アルファベットバーの UI を返す。
 */
function AlphabetBar(): JSX.Element {
  const { handleAlphabetClick } = useContacts();

  return (
    <Box className={styles.alphabetContainer}>
      {/* 指定された文字ごとにボタンを生成 */}
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
