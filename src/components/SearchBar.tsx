import React from 'react';
import { useContacts } from '../contexts/ContactContext';
import styles from './SearchBar.module.css';
import { TextField } from '@mui/material';

function SearchBar() {
  const { searchQuery, setSearchQuery } = useContacts();

  return (
    <TextField
      label="名前で検索"
      variant="filled"
      fullWidth
      className={styles.searchBar}
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  );
}

export default SearchBar;
