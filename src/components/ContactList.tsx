import React from 'react';
import Contact from '../models/Contact';
import styles from './ContactList.module.css';
import {
  List,
  ListItem,
  Card,
  CardContent,
  Typography,
  IconButton,
  Checkbox,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// ContactListProps という名前の型を定義する
type ContactListProps = {
  contacts: { [key: string]: Contact[] };
  listRefs: React.MutableRefObject<{ [key: string]: HTMLLIElement | null }>;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
  onToggleSelect: (id: string) => void;
  selectedContacts: string[];
};

// ContactListProps 型の引数を受け取る ContactList コンポーネントを定義する
function ContactList({
  contacts,
  listRefs,
  onEdit,
  onDelete,
  onToggleSelect,
  selectedContacts,
}: ContactListProps) {
  return (
    <List className={styles.list}>
      {/* contactsオブジェクトの各キー (alphabet)に対応するグループをループして表示する */}
      {Object.entries(contacts).map(([letter, group]) => (
        <ListItem
          key={letter}
          ref={(el) => (listRefs.current[letter] = el)}
          className={styles.listItem}
        >
          <Typography variant="h5" className={styles.sectionTitle}>
            {letter}
          </Typography>
          {group.map((contact) => (
            <Card key={contact.id} className={styles.contactCard}>
              <Checkbox
                checked={selectedContacts.includes(contact.id)}
                onChange={() => onToggleSelect(contact.id)}
                className={styles.checkbox}
              />
              <CardContent>
                <Typography variant="h5">{contact.name}</Typography>
                <Typography variant="h5">電話番号: {contact.phone}</Typography>
                {contact.memo && (
                  <Typography variant="h6">メモ: {contact.memo}</Typography>
                )}
                <IconButton color="primary" onClick={() => onEdit(contact)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => onDelete(contact.id)}>
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          ))}
        </ListItem>
      ))}
    </List>
  );
}

export default ContactList;
