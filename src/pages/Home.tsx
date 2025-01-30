import React, { useState, useEffect, useRef } from 'react';
import Contact from '../models/Contact';
import { getContacts } from '../utils/localStorage';
import ContactList from '../components/ContactList';
import SearchBar from '../components/SearchBar';
import AlphabetBar from '../components/AlphabetBar';
import ContactFormDialog from '../components/ContactFormDialog';
import { Container, Typography, IconButton, AppBar } from '@mui/material';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import Grid from '@mui/material/Grid2';
function Home() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const listRefs = useRef<{ [key: string]: HTMLLIElement | null }>({});
  const [openDialog, setOpenDialog] = useState(false);
  const [editContact, setEditContact] = useState<Contact | null>(null);

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
    setEditContact(null); //明示的に「空の値」を意味し、リセット
    setOpenDialog(true); //Dialog開く
  };

  // Contactの編集ダイアログを開く
  const handleEditContact = (contact: Contact) => {
    setEditContact(contact); //既存のcontactをセット
    setOpenDialog(true); //Dialog開く
  };

  // TODO: 削除の処理を追加する;

  // Contactの保存が成功したときに、ダイアログを閉じて、contactsを更新する
  const handleSaveSuccess = () => {
    setContacts(getContacts()); //Saveの関数呼ぶ(utilsに定義)
    setOpenDialog(false); //ダイアログ閉じる
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
    <Container maxWidth="xl" sx={{ height: '100vh', paddingTop: 8 }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, paddingTop: 2 }}
      >
        <IconButton
          color="inherit"
          aria-label="新規作成"
          onClick={handleNewContact}
          sx={{ position: 'absolute', top: 16, right: 16, fontSize: '5rem' }}
        >
          <AddReactionIcon fontSize="inherit" />
        </IconButton>
        <Typography variant="h1" gutterBottom textAlign="center">
          Contact Book
        </Typography>
        <SearchBar onSearch={handleSearch} />
      </AppBar>
      <Grid container spacing={2} sx={{ marginTop: 20 }}>
        <Grid size={{ xs: 12, md: 10 }}>
          <ContactList
            contacts={groupedContacts}
            listRefs={listRefs}
            onEdit={handleEditContact}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 2 }}>
          <AlphabetBar onClick={handleAlphabetClick} />
        </Grid>
      </Grid>
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
