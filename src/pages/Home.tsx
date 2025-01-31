import React from 'react';
import { useContacts } from '../contexts/ContactContext';
import ContactList from '../components/ContactList';
import SearchBar from '../components/SearchBar';
import AlphabetBar from '../components/AlphabetBar';
import ContactFormDialog from '../components/ContactFormDialog';
import styles from './Home.module.css';
import {
  Container,
  Typography,
  IconButton,
  AppBar,
  Button,
  Box,
} from '@mui/material';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import Grid from '@mui/material/Grid2';
function Home() {
  const { handleDeleteMultiple, selectedContacts, handleNewContact } =
    useContacts();
  return (
    <Container maxWidth="xl" className={styles.container}>
      {/* ヘッダー (AppBar) */}
      <AppBar className={styles.appBar}>
        <Box className={styles.buttonContainer}>
          {/* 左側に削除ボタンとアイコンを配置 */}
          <Button
            variant="contained"
            color="error"
            className={styles.deleteButton}
            onClick={handleDeleteMultiple}
            disabled={selectedContacts.length === 0}
          >
            連絡先一括削除
          </Button>
          <IconButton
            aria-label="新規作成"
            onClick={handleNewContact}
            className={styles.iconButton}
          >
            <AddReactionIcon fontSize="large" />
          </IconButton>
        </Box>
        <Typography variant="h2" className={styles.title}>
          Contact Book
        </Typography>
        <Box className={styles.searchBarContainer}>
          <SearchBar />
        </Box>
      </AppBar>
      {/* メインコンテンツ */}
      <Grid container className={styles.gridContainer}>
        <Grid size={{ xs: 12, md: 10 }}>
          <ContactList />
        </Grid>
        <Grid size={{ xs: 12, md: 2 }}>
          <AlphabetBar />
        </Grid>
      </Grid>
      {/* ContactFormDialog */}
      <ContactFormDialog />
    </Container>
  );
}

export default Home;
