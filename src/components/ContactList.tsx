import React from 'react';
import Contact from '../models/Contact';
import { List, ListItem, Card, CardContent, Typography } from '@mui/material';

type ContactListProps = {
  contacts: { [key: string]: Contact[] };
  listRefs: React.MutableRefObject<{ [key: string]: HTMLLIElement | null }>;
};
function ContactList({ contacts, listRefs }: ContactListProps) {
  return (
    <List sx={{ padding: '10px' }}>
      {Object.entries(contacts).map(([letter, group]) => (
        <ListItem
          key={letter}
          ref={(el) => (listRefs.current[letter] = el)}
          sx={{ flexDirection: 'column', alignItems: 'flex-start', mb: 4 }}
        >
          <Typography
            variant="h5"
            component="h5"
            sx={{ marginY: 2, fontWeight: 'bold' }}
          >
            {letter}
          </Typography>
          {group.map((contact) => (
            <Card
              key={contact.id}
              sx={{
                marginBottom: 2,
                width: '100%',
                maxWidth: '100%',
                boxShadow: 3,
                padding: 2,
              }}
            >
              <CardContent>
                <Typography variant="h5">{contact.name}</Typography>
                <Typography variant="h5">電話番号: {contact.phone}</Typography>
                {contact.memo && (
                  <Typography variant="h6">メモ: {contact.memo}</Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </ListItem>
      ))}
    </List>
  );
}

export default ContactList;
