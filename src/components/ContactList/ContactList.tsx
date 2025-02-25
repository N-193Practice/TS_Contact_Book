import { JSX, useEffect } from 'react';
import { useContacts } from '../../contexts/useContacts';
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
import { NavLink } from 'react-router';

/**
 * `ContactList` コンポーネント
 * 連絡先リストを表示し、編集や削除が可能。
 * 各連絡先はグループ化され、アルファベット順または五十音順に並ぶ。
 * @returns {JSX.Element} 連絡先リストの UI を返す。
 */

function ContactList(): JSX.Element {
  const {
    contacts,
    groupedContacts,
    listRefs,
    selectedContacts,
    handleEditContact,
    handleDeleteContact,
    handleMultipleSelected,
    setContacts,
  } = useContacts();

  useEffect(() => {
    // グループ化された連絡先リストを作成
    setContacts(contacts || []);
  }, [contacts, setContacts]);

  return (
    <List className={styles.list}>
      {/* groupedContacts オブジェクトの各キー (alphabet) に対応するグループをループして表示 */}
      {Object.entries(groupedContacts).map(([letter, group]) => (
        <ListItem
          key={letter}
          ref={(el) => {
            if (el && listRefs.current) listRefs.current[letter] = el;
          }}
          className={styles.listItem}
        >
          {/* グループタイトル（アルファベットまたは五十音） */}
          <Typography variant="h5" className={styles.sectionTitle}>
            {letter}
          </Typography>
          {/* 連先一覧を表示 */}
          {group.map((contact) => (
            <Card key={contact.id} className={styles.contactCard}>
              {/* 連絡先の一括削除の選択チェックボックス */}
              <Checkbox
                checked={selectedContacts.includes(contact.id)}
                onChange={() => handleMultipleSelected(contact.id)}
                className={styles.checkbox}
              />
              <CardContent>
                <Typography variant="h5">氏名:{contact.name}</Typography>
                <Typography variant="h5">電話番号: {contact.phone}</Typography>
                {contact.memo && (
                  <Typography variant="h6" className={styles.memo}>
                    {contact.memo}
                  </Typography>
                )}
                {/* 編集ボタン */}
                <IconButton
                  onClick={() => handleEditContact(contact)}
                  className={styles.editButton}
                  component={NavLink}
                  aria-hidden="false"
                  to={`/contacts/edit/${contact.id}`}
                >
                  <EditIcon />
                </IconButton>
                {/* 削除ボタン */}
                <IconButton
                  onClick={() => handleDeleteContact(contact.id)}
                  className={styles.deleteButton}
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
