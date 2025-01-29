import React, { useState, useEffect, useRef } from 'react';
import Contact from '../models/Contact';
import { getContacts } from '../utils/localStorage';
import ContactList from '../components/ContactList';
import SearchBar from '../components/SearchBar';
import AlphabetBar from '../components/AlphabetBar';
import ContactFormDialog from '../components/ContactFormDialog';
import { Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import AddReactionIcon from '@mui/icons-material/AddReaction';
function Home() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const listRefs = useRef<{ [key: string]: HTMLLIElement | null }>({});
  const [openDialog, setOpenDialog] = useState(false);
  const [editContact, setEditContact] = useState<Contact | null>(null);

  useEffect(() => {
    setContacts(getContacts());
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleNewContact = () => {
    setEditContact(null);
    setOpenDialog(true);
  };

  const handleEditContact = (contact: Contact) => {
    setEditContact(contact);
    setOpenDialog(true);
  };

  const handleSaveSuccess = () => {
    setContacts(getContacts());
    setOpenDialog(false);
  };

  const filteredContacts = contacts
    .filter((contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name, 'ja'));

  const handleAlphabetClick = (letter: string) => {
    listRefs.current[letter]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

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

    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(contact);
    return acc;
  }, {} as { [key: string]: Contact[] });

  return (
    <Container maxWidth="xl" sx={{ height: '100vh', paddingTop: 4 }}>
      <IconButton
        color="primary"
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
      <Grid container spacing={2} sx={{ marginTop: 3 }}>
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
      {/* ポップアップコンポーネント */}
      <ContactFormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        contact={editContact}
        onSaveSuccess={handleSaveSuccess}
      />
    </Container>
  );
}
export default Home;
