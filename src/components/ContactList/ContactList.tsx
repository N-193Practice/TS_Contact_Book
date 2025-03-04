import { JSX, useState } from 'react';
import { useContacts } from '../../contexts/useContacts';
import { useGroups } from '../../contexts/useGroups';
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
import { NavLink, useSubmit } from 'react-router';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import NotificationBanner from '../../components/NotificationBanner/NotificationBanner';
import { MESSAGES } from '../../utils/message';

/**
 * `ContactList` コンポーネント
 * 連絡先リストを表示し、編集や削除が可能。
 * 各連絡先はグループ化され、アルファベット順または五十音順に並ぶ。
 * @returns {JSX.Element} 連絡先リストの UI を返す。
 */

function ContactList(): JSX.Element {
  const submit = useSubmit();

  const {
    groupedContacts,
    listRefs,
    selectedContacts,
    handleMultipleSelected,
    successMessage,
    setSuccessMessage,
  } = useContacts();

  const { groups } = useGroups();

  // 削除確認ダイアログの状態
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  /**
   * グループ名を取得する関数
   * @param {string} groupId
   * @returns {string} 連絡先と紐づいているグループ名を返す。
   */
  const getGroupName = (groupId: string): string => {
    if (!groupId) return '';
    const group = groups.find((g) => g.id === groupId);
    return group?.name || '';
  };

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
  const handleConfirmDelete = async (): Promise<void> => {
    if (deleteTargetId) {
      const body = {
        id: deleteTargetId,
      };
      await submit(body, { method: 'delete', action: '/' });
      setConfirmOpen(false);
      setDeleteTargetId(null);
      setSuccessMessage(MESSAGES.CONTACT.DELETE_SUCCESS);
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
                  <Typography variant="h5" className={styles.groupName}>
                    グループ名:
                    {contact.groupId ? getGroupName(contact.groupId) : ''}
                  </Typography>
                  {/* 編集ボタン */}
                  <IconButton
                    className={styles.editButton}
                    aria-label="編集"
                    component={NavLink}
                    to={`/contacts/edit/${contact.id}`}
                  >
                    <EditIcon />
                  </IconButton>
                  {/* 削除ボタン */}
                  <IconButton
                    className={styles.deleteButton}
                    aria-label="削除"
                    onClick={() => handleDeleteClick(contact.id)}
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
        message={`${MESSAGES.COMMON.CONFIRM_DELETE}`}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
export default ContactList;
