import React from 'react';
import styles from './SearchBar.module.css';
import { TextField } from '@mui/material';

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
    <TextField
      label="名前で検索"
      variant="filled"
      fullWidth
      className={styles.searchBar}
      onChange={handleInputChange}
    />
  );
}

export default SearchBar;
