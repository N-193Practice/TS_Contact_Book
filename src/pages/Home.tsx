import React from 'react';
import { useContacts } from '../contexts/ContactContext';
import ContactList from '../components/ContactList';
import SearchBar from '../components/SearchBar';
import AlphabetBar from '../components/AlphabetBar';
import ContactFormDialog from '../components/ContactFormDialog';
import styles from './Home.module.css';
import { Typography, IconButton, Button } from '@mui/material';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import Grid from '@mui/material/Grid2';
function Home() {
  const { handleDeleteMultiple, selectedContacts, handleNewContact } =
    useContacts();
  return (
    <>
      {/* Navgation */}
      <nav className={styles.navbar}>
        {/* 上部（ボタン + 検索バー + タイトル） */}
        <div className={styles.topSection}>
          <div className={styles.leftButtons}>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteMultiple}
              disabled={selectedContacts.length === 0}
            >
              連絡先一括削除
            </Button>
            <IconButton
              aria-label="新規作成"
              color="secondary"
              onClick={handleNewContact}
            >
              <AddReactionIcon fontSize="large" />
            </IconButton>
          </div>
          {/* 検索バーを追加 */}
          <div className={styles.searchBar}>
            <SearchBar />
          </div>
          <Typography variant="h3" className={styles.title}>
            Contact Book
          </Typography>
        </div>
      </nav>
      {/* main */}
      <Grid container className={styles.gridContainer} spacing={1}>
        <Grid size={{ xs: 12, md: 8 }} className={styles.contactListContainer}>
          <ContactList />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }} className={styles.alphabetBarContainer}>
          <AlphabetBar />
        </Grid>
      </Grid>
      {/* ContactFormDialog */}
      <ContactFormDialog />
    </>
  );
}

export default Home;
