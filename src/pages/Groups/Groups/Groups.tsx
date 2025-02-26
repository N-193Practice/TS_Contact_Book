import { JSX, useEffect, useState } from 'react';
import { NavLink, useSubmit } from 'react-router';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';

import styles from './Groups.module.css';
import { useGroups } from '../../../contexts/useGroups'; // **useGroups を使用**
import ConfirmDialog from '../../../components/ConfirmDialog/ConfirmDialog';
import NotificationBanner from '../../../components/NotificationBanner/NotificationBanner';

function Groups(): JSX.Element {
  const { groups, reloadGroups } = useGroups();
  const submit = useSubmit();
  const [localGroups, setLocalGroups] = useState(groups);

  // 削除確認ダイアログの状態
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // 通知メッセージの状態
  const [message, setMessage] = useState<string | null>(null);
  const [messageSeverity, setMessageSeverity] = useState<
    'success' | 'error' | 'info'
  >('info');

  // **初回レンダリング時にのみグループデータを取得**
  useEffect(() => {
    console.log('🚀 [useEffect] reloadGroups を実行');
    reloadGroups();
  }, [reloadGroups]);

  useEffect(() => {
    console.log('🚀 [useEffect] localGroups を更新:', groups);
    setLocalGroups([...groups]); // **新しい配列を作ることで変更を検知**
  }, [groups]);

  /**
   * 削除ボタンを押したときの処理
   */
  const handleDeleteClick = (id: string) => {
    setDeleteTargetId(id);
    setConfirmOpen(true);
  };

  /**
   * 削除処理の実行
   */
  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      submit(null, {
        method: 'delete',
        action: `/groups/delete/${deleteTargetId}`,
      });

      reloadGroups(); // **削除後にグループを更新**

      setMessage('グループを削除しました。');
      setMessageSeverity('success');
    }
    setConfirmOpen(false);
    setDeleteTargetId(null);
  };

  return (
    <>
      {message && (
        <NotificationBanner
          message={message}
          severity={messageSeverity}
          onClose={() => setMessage(null)}
        />
      )}

      <List className={styles.list}>
        {localGroups.map((group) => (
          <ListItem
            key={group.id}
            disableGutters
            className={styles.listItem}
            secondaryAction={
              <div className={styles.actions}>
                <IconButton
                  aria-label="編集"
                  component={NavLink}
                  to={`/groups/edit/${group.id}`}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label="削除"
                  onClick={() => handleDeleteClick(group.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            }
          >
            <ListItemText primary={group.name} />
          </ListItem>
        ))}
      </List>

      <IconButton
        aria-label="新規作成"
        className={styles.addButton}
        component={NavLink}
        to={'/groups/new'}
      >
        <AddIcon className={styles.addIcon} />
      </IconButton>

      <ConfirmDialog
        open={confirmOpen}
        title="グループ削除確認"
        message="このグループを削除してもよろしいですか？"
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

export default Groups;
