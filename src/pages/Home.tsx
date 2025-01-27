import React, { useState, useEffect, useRef } from 'react';
import Contact from '../models/Contact';
import { getContacts } from '../utils/localStorage';
import SearchBar from '../components/SearchBar';
import ContactList from '../components/ContactList';
import AlphabetBar from '../components/AlphabetBar';
import { Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2'; // Updated to use Grid2

function Home() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const listRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

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

  // グループ化された連絡先を作成
  const groupedContacts = filteredContacts.reduce((acc, contact) => {
    const firstLetter = contact.name[0].toUpperCase();
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(contact);
    return acc;
  }, {} as { [key: string]: Contact[] });

  return (
    <Container maxWidth="lg" sx={{ height: '100vh', paddingTop: 4 }}>
      <Typography variant="h1" gutterBottom>
        Contact Book
      </Typography>
      <SearchBar onSearch={handleSearch} />
      <Grid container spacing={2} sx={{ marginTop: 3 }}>
        <Grid size={11}>
          <ContactList contacts={groupedContacts} listRefs={listRefs} />
        </Grid>
        <Grid size={1}>
          <AlphabetBar onClick={handleAlphabetClick} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;
