import { JSX, useEffect, useState } from 'react';
import { NavLink, useSubmit, useLoaderData, useNavigate } from 'react-router';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import styles from './Groups.module.css';
import { useGroups } from '../../../contexts/useGroups';
import ConfirmDialog from '../../../components/ConfirmDialog/ConfirmDialog';
import NotificationBanner from '../../../components/NotificationBanner/NotificationBanner';
import { MESSAGES } from '../../../utils/message';
import { Group } from '../../../models/types';

/**
 * `Groups` コンポーネント
 * 新規グループの作成画面。
 * @returns {JSX.Element} 新規グループの作成画面の UI を返す。
 */
function Groups(): JSX.Element {
  const submit = useSubmit();
  const navigate = useNavigate();
  const groupsData: Group[] = useLoaderData();
  const {
    groups,
    setGroups,
    errorMessage,
    successMessage,
    setErrorMessage,
    setSuccessMessage,
  } = useGroups();

  // 削除確認ダイアログの状態
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // 通知メッセージの状態
  const [message, setMessage] = useState<string | null>(null);
  const [messageSeverity, setMessageSeverity] = useState<
    'success' | 'error' | 'info'
  >('info');

  // エラーメッセージと成功メッセージの状態を監視し、変更があれば通知メッセージを表示する。
  useEffect(() => {
    if (errorMessage) {
      setMessage(errorMessage);
      setMessageSeverity('error');
    }
    if (successMessage) {
      setMessage(successMessage);
      setMessageSeverity('success');
    }
  }, [errorMessage, successMessage]);

  useEffect(() => {
    if (groupsData) {
      setGroups(groupsData);
    }
  }, [groupsData, setGroups]);

  // GroupFormの処理後、通知メッセージが表示されている場合、3秒後に非表示にする。

  /**
   * 削除ボタンを押したときの処理をする関数。
   * @param {string} id - 削除対象のグループID。
   * @returns {void} この関数は値を返さず、削除ボタンを押したときに呼び出される関数。
   */
  const handleDeleteClick = (id: string): void => {
    setDeleteTargetId(id);
    setConfirmOpen(true);
  };

  /**
   * 削除処理の実行する関数。
   * @returns {void} この関数は値を返さず、削除処理が実行される。
   */
  const handleConfirmDelete = async (): Promise<void> => {
    if (deleteTargetId) {
      try {
        await submit(null, {
          method: 'delete',
          action: `/groups/delete/${deleteTargetId}`,
        });

        setSuccessMessage(MESSAGES.GROUP.DELETE_SUCCESS);
        setMessageSeverity('success');
      } catch {
        setErrorMessage(MESSAGES.GROUP.DELETE_FAIL);
        setMessageSeverity('error');
      }
    }
    setConfirmOpen(false);
    setDeleteTargetId(null);
    navigate(-1);
  };

  const handleMessageClose = (): void => {
    setMessage(null);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  return (
    <>
      {message && (
        <NotificationBanner
          message={message}
          severity={messageSeverity}
          onClose={() => handleMessageClose()}
        />
      )}

      <List className={styles.list}>
        {groups.map((group) => (
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
