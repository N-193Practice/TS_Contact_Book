import React from 'react';
import { useContacts } from '../contexts/ContactContext';
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
import styles from './ContactList.module.css';

function ContactList() {
  const {
    groupedContacts,
    listRefs,
    selectedContacts,
    handleEditContact,
    handleDeleteSelected,
    handleDeleteAll,
  } = useContacts();

  return (
    <List className={styles.list}>
      {/* groupedContacts オブジェクトの各キー (alphabet) に対応するグループをループして表示 */}
      {Object.entries(groupedContacts).map(([letter, group]) => (
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
                onChange={() => handleDeleteAll(contact.id)}
                className={styles.checkbox}
              />
              <CardContent>
                <Typography variant="h5">{contact.name}</Typography>
                <Typography variant="h5">電話番号: {contact.phone}</Typography>
                {contact.memo && (
                  <Typography variant="h6">メモ: {contact.memo}</Typography>
                )}
                <IconButton
                  color="primary"
                  onClick={() => handleEditContact(contact)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleDeleteSelected(contact.id)}
                >
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
