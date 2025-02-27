import { JSX, useState } from 'react';
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
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import NotificationBanner from '../../components/NotificationBanner/NotificationBanner';

/**
 * `ContactList` コンポーネント
 * 連絡先リストを表示し、編集や削除が可能。
 * 各連絡先はグループ化され、アルファベット順または五十音順に並ぶ。
 * @returns {JSX.Element} 連絡先リストの UI を返す。
 */

function ContactList(): JSX.Element {
  const {
    groupedContacts,
    listRefs,
    selectedContacts,
    handleEditContact,
    handleDeleteContact,
    handleMultipleSelected,
    successMessage,
    setSuccessMessage,
  } = useContacts();

  // 削除確認ダイアログの状態
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  /**
   * 削除ボタンを押したときの処理（削除確認ダイアログを開く）
   * @param {string} id - 削除対象の連絡先ID
   * @returns {void} この関数は値を返さず、削除ボタンを押したときに呼び出される関数。
   */
  const handleDeleteClick = (id: string): void => {
    setDeleteTargetId(id);
    setConfirmOpen(true);
  };

  /**
   * 削除確認後の処理（連絡先削除を実行）
   * @returns {void} この関数は値を返さず、削除確認ダイアログを閉じる。
   */
  const handleConfirmDelete = (): void => {
    if (deleteTargetId) {
      handleDeleteContact(deleteTargetId);
      setConfirmOpen(false);
      setDeleteTargetId(null);
    }
  };

  return (
    <>
      {/* 成功メッセージを表示 */}
      {successMessage && (
        <NotificationBanner
          message={successMessage}
          severity="success"
          onClose={() => setSuccessMessage(null)}
        />
      )}
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
                  <Typography variant="h5">
                    電話番号: {contact.phone}
                  </Typography>
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
                    onClick={() => handleDeleteClick(contact.id)}
                    className={styles.deleteButton}
                    aria-label="削除"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardContent>
              </Card>
            ))}
          </ListItem>
        ))}
      </List>
      {/* 削除確認ダイアログ */}
      <ConfirmDialog
        open={confirmOpen}
        title="連絡先削除確認"
        message="この連絡先を削除してもよろしいですか？"
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
export default ContactList;
