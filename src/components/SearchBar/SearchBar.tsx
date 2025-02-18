import { JSX } from 'react';
import { useContacts } from '../../contexts/useContacts';
import styles from './SearchBar.module.css';
import { TextField } from '@mui/material';

/**
 * `SearchBar` コンポーネント
 * 連絡先の名前で検索するための検索バー。
 * `useContacts` フックを利用して検索クエリの状態を管理。
 * @returns {JSX.Element} 検索バーの UI を返す。
 */
function SearchBar(): JSX.Element {
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
