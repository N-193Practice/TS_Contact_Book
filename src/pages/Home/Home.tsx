import { JSX } from 'react';
import useContacts from '../../contexts/useContacts';
import ContactList from '../../components/ContactList/ContactList';
import SearchBar from '../../components/SearchBar/SearchBar';
import AlphabetBar from '../../components/AlphabetBar/AlphabetBar';
import ContactFormDialog from '../../components/ContactFormDialog/ContactFormDialog';
import styles from './Home.module.css';
import { Typography, IconButton, Button } from '@mui/material';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import Grid from '@mui/material/Grid2';

/**
 * `Home` コンポーネント
 * 連絡先のメイン画面。ナビゲーション、検索バー、連絡先リスト、
 * アルファベットフィルター、および連絡先追加・削除機能を提供する。
 * @returns {JSX.Element} ホーム画面の UI を返す。
 */
function Home(): JSX.Element {
  const {
    handleDeleteMultiple,
    selectedContacts,
    handleNewContact,
    selectAllContacts,
    deselectAllContacts,
    contacts,
  } = useContacts();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Typography className={styles.title}>Contact Book</Typography>
        {/* SearchBar */}
        <div className={styles.searchBarContainer}>
          <SearchBar />
        </div>
        {/* Navigation */}
        <nav className={styles.navbar}>
          <div className={styles.selectRightButton}>
            <Button
              variant="outlined"
              onClick={selectAllContacts}
              disabled={selectedContacts.length === contacts.length}
              className={styles.selectAllButton}
            >
              全ての連絡先を選択
            </Button>
            <Button
              variant="outlined"
              onClick={deselectAllContacts}
              disabled={selectedContacts.length === 0}
              className={styles.deselectAllButton}
            >
              全選択解除
            </Button>
          </div>
          <div className={styles.navbarLeft}>
            {/* 一括削除ボタン（選択された連絡先がある場合に有効） */}
            <Button
              variant="contained"
              onClick={handleDeleteMultiple}
              disabled={selectedContacts.length === 0}
              className={styles.deleteButton}
              color="error"
            >
              連絡先一括削除
            </Button>
            <IconButton
              aria-label="新規作成"
              onClick={handleNewContact}
              className={styles.iconButton}
            >
              <AddReactionIcon focusable="false" className={styles.icon} />
            </IconButton>
          </div>
          <div className={styles.navbarRight}></div>
        </nav>
      </header>
      {/* main */}
      <Grid className={styles.contactsContainer}>
        {/* 連絡先リスト */}
        <ContactList />
      </Grid>
      <Grid className={styles.alphabetContainer}>
        {/* アルファベットナビゲーションバー */}
        <AlphabetBar />
      </Grid>
      {/* 連絡先追加・編集用ダイアログ */}
      <ContactFormDialog />
    </div>
  );
}

export default Home;
