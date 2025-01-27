import React from 'react';
import Contact from '../models/Contact';
import { List, ListItem, ListItemText, Card, CardContent } from '@mui/material';

type ContactListProps = {
  contacts: Contact[];
};
function ContactList({ contacts }: ContactListProps) {
  return (
    <List>
      {contacts.map((contact) => (
        <Card key={contact.id} sx={{ marginBottom: 2 }}>
          <CardContent>
            <ListItem>
              <ListItemText
                primary={contact.name}
                secondary={
                  <>
                    <div>電話番号: {contact.phone}</div>
                    {contact.memo && <div>メモ: {contact.memo}</div>}
                  </>
                }
              />
            </ListItem>
          </CardContent>
        </Card>
      ))}
    </List>
  );
}

export default ContactList;
