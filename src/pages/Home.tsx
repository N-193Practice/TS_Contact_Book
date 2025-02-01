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
        {/* 上部（ボタン2つ＋タイトル） */}
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
          <Typography variant="h3" className={styles.title}>
            Contact Book
          </Typography>
        </div>
        {/* SearchBar */}
        <div className={styles.searchBar}>
          <SearchBar />
        </div>
      </nav>
      {/* main */}
      <Grid container className={styles.gridContainer} spacing={2}>
        <Grid size={{ xs: 12, md: 10 }}>
          <ContactList />
        </Grid>
        <Grid size={{ xs: 12, md: 2 }}>
          <AlphabetBar />
        </Grid>
      </Grid>
      {/* ContactFormDialog */}
      <ContactFormDialog />
    </>
  );
}

export default Home;
