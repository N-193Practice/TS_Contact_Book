import React from 'react';
import { TextField } from '@mui/material';

type SearchBarProps = {
  onSearch: (query: string) => void;
};

function SearchBar({ onSearch }: SearchBarProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <TextField
      label="名前で検索"
      variant="outlined"
      fullWidth
      onChange={handleInputChange}
    />
  );
}

export default SearchBar;
