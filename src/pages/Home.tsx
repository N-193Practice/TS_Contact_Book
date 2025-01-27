import React, { useState, useEffect } from 'react';
import Contact from '../models/Contact.ts';
import { getContacts } from '../utils/localStorage.ts';
import SearchBar from '../components/SearchBar.tsx';
import ContactList from '../components/ContactList.tsx';
import { Container, Typography, Box } from '@mui/material';

function Home() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

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

  return (
    <Container maxWidth="lg">
      <Box sx={{ paddingTop: 4 }}>
        <Typography variant="h1" gutterBottom>
          Contact Book
        </Typography>
        <SearchBar onSearch={handleSearch} />
        <Box sx={{ paddingTop: 3 }}>
          <ContactList contacts={filteredContacts} />
        </Box>
      </Box>
    </Container>
  );
}

export default Home;
