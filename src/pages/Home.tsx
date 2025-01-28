import React, { useState, useEffect, useRef } from 'react';
import Contact from '../models/Contact';
import { getContacts } from '../utils/localStorage';
import SearchBar from '../components/SearchBar';
import ContactList from '../components/ContactList';
import AlphabetBar from '../components/AlphabetBar';
import { Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
function Home() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const listRefs = useRef<{ [key: string]: HTMLLIElement | null }>({});

  useEffect(() => {
    setContacts(getContacts());
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
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
      <Typography variant="h1" gutterBottom textAlign="center">
        Contact Book
      </Typography>
      <SearchBar onSearch={handleSearch} />
      <Grid container spacing={2} sx={{ marginTop: 3 }}>
        <Grid size={{ xs: 12, md: 10 }}>
          <ContactList contacts={groupedContacts} listRefs={listRefs} />
        </Grid>
        <Grid size={{ xs: 12, md: 2 }}>
          <AlphabetBar onClick={handleAlphabetClick} />
        </Grid>
      </Grid>
    </Container>
  );
}
export default Home;
