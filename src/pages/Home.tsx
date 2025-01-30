import React, { useState, useEffect, useRef } from 'react';
import Contact from '../models/Contact';
import { getContacts, deleteContact } from '../utils/localStorage';
import ContactList from '../components/ContactList';
import SearchBar from '../components/SearchBar';
import AlphabetBar from '../components/AlphabetBar';
import ContactFormDialog from '../components/ContactFormDialog';
import styles from '../styles/Home.module.css';
import {
  Container,
  IconButton,
  Button,
  AppBar,
  Box,
  Typography,
} from '@mui/material';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import Grid from '@mui/material/Grid2';
//TODO: CSSモジュールの定義と、コンポーネントのスタイルを定義する
//TODO:新規登録のボタンを押すとリフレッシュされていない問題を解決する
function Home() {
  const [contacts, setContacts] = useState<Contact[]>([]); // 連絡先のリスト
  const [searchQuery, setSearchQuery] = useState(''); // 検索クエリ
  const listRefs = useRef<{ [key: string]: HTMLLIElement | null }>({}); // アルファベットのリストをスクロールするためのリファレンス
  const [openDialog, setOpenDialog] = useState(false); // コンタクト編集ダイアログのオープン状態
  const [editContact, setEditContact] = useState<Contact | null>(null); // コンタクト編集ダイアログで編集する連絡先
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]); // 連絡先の複数選択(削除用)
  // contacts をロードする
  useEffect(() => {
    setContacts(getContacts());
  }, []);

  // SearchBarで使うために、検索クエリをセットする
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Contactの新規作成ダイアログを開く
  const handleNewContact = () => {
    setEditContact(null);
    setOpenDialog(true);
  };

  // Contactの編集ダイアログを開く
  const handleEditContact = (contact: Contact) => {
    setEditContact(contact);
    setOpenDialog(true);
  };

  // Contactの保存が成功したときに、ダイアログを閉じて、contactsを更新する
  const handleSaveSuccess = () => {
    setContacts(getContacts());
    setOpenDialog(false);
  };

  // Contact削除の処理をする
  const handleDeleteSelected = (id: string) => {
    deleteContact(id);
    setContacts(getContacts());
  };

  // Contact複数選択する
  const handleDeleteAll = (id: string) => {
    setSelectedContacts((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((id) => id !== id)
        : [...prevSelected, id]
    );
  };

  // Contact複数選択されたものを削除する
  const handleDeleteMultiple = () => {
    if (selectedContacts.length === 0) {
      alert('削除する連絡先を選択してください');
      return;
    }
    selectedContacts.forEach((id) => deleteContact(id));
    setContacts(getContacts());
    setSelectedContacts([]);
  };

  // SearchBarで使うために、名前に検索クエリを含むコンタクトをフィルタリングする
  const filteredContacts = contacts
    .filter((contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name, 'ja'));

  // AlphabetBar で使うために、クリックした文字に対応するリストをスクロールする
  const handleAlphabetClick = (letter: string) => {
    listRefs.current[letter]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  // AlphabetBar で使うために、名前の先頭文字でグループ化する
  const groupedContacts = filteredContacts.reduce((acc, contact) => {
    const firstChar = contact.name[0].toUpperCase();

    // 日本語の五十音分類
    const firstLetter = /^[A-Z]/.test(firstChar)
      ? firstChar
      : /^[あ-お]/.test(firstChar)
      ? 'あ'
      : /^[か-こ]/.test(firstChar)
      ? 'か'
      : /^[さ-そ]/.test(firstChar)
      ? 'さ'
      : /^[た-と]/.test(firstChar)
      ? 'た'
      : /^[な-の]/.test(firstChar)
      ? 'な'
      : /^[は-ほ]/.test(firstChar)
      ? 'は'
      : /^[ま-も]/.test(firstChar)
      ? 'ま'
      : /^[やゆよ]/.test(firstChar)
      ? 'や'
      : /^[ら-ろ]/.test(firstChar)
      ? 'ら'
      : /^[わをん]/.test(firstChar)
      ? 'わ'
      : '#';

    // グループ化したコンタクトをオブジェクトに変換する
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(contact);
    return acc;
  }, {} as { [key: string]: Contact[] });

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
        <Typography className={styles.searchBarContainer}>
          <SearchBar onSearch={handleSearch} />
        </Typography>
      </AppBar>
      {/* メインコンテンツ */}
      <Grid container className={styles.gridContainer}>
        <Grid size={{ xs: 12, md: 10 }}>
          <ContactList
            contacts={groupedContacts}
            listRefs={listRefs}
            onEdit={handleEditContact}
            onDelete={handleDeleteSelected}
            onToggleSelect={handleDeleteAll}
            selectedContacts={selectedContacts}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 2 }}>
          <AlphabetBar onClick={handleAlphabetClick} />
        </Grid>
      </Grid>

      {/* ContactFormDialog */}
      <ContactFormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSaveSuccess={handleSaveSuccess}
        contact={editContact}
      />
    </Container>
  );
}

export default Home;
