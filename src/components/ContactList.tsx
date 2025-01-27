import React from 'react';
import Contact from '../models/Contact.ts';
import {
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Typography,
} from '@mui/material';

type ContactListProps = {
  contacts: { [key: string]: Contact[] };
  listRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
};

function ContactList({ contacts, listRefs }: ContactListProps) {
  return (
    <List>
      {Object.entries(contacts).map(([letter, group]) => (
        <div key={letter} ref={(el) => (listRefs.current[letter] = el)}>
          <Typography variant="h6" sx={{ marginY: 2 }}>
            {letter}
          </Typography>
          {group.map((contact) => (
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
        </div>
      ))}
    </List>
  );
}

export default ContactList;
