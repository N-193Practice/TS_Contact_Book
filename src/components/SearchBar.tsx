import React from 'react';
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
      sx={{
        maxWidth: '60%',
        margin: '0 auto',
        display: 'block',
        borderColor: 'primary.main',
        bgcolor: 'white',
      }}
      onChange={handleInputChange}
    />
  );
}
export default SearchBar;
