import React from 'react';
import styles from '../styles/SearchBar.module.css';
import { Box, TextField } from '@mui/material';

//TODO: CSSモジュールの定義と、コンポーネントのスタイルを定義する

// SearchBarProps という名前の型を定義する
type SearchBarProps = {
  onSearch: (query: string) => void;
};

// SearchBarProps 型の引数を受け取る SearchBar コンポーネントを定義する
function SearchBar({ onSearch }: SearchBarProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <Box className={styles.searchBarContainer}>
      <TextField
        label="名前で検索"
        variant="filled"
        fullWidth
        className={styles.searchBar}
        onChange={handleInputChange}
      />
    </Box>
  );
}

export default SearchBar;
