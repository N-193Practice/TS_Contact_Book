import { JSX } from 'react';
import { useGroups } from '../../contexts/useGroups';
import { useContacts } from '../../contexts/useContacts';
import { Link } from 'react-router';
import { Select, MenuItem, Button } from '@mui/material';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import NotificationBanner from '../../components/NotificationBanner/NotificationBanner';
import { MESSAGES } from '../../utils/message';
import { useSubmit, useNavigate } from 'react-router';

// GroupSelect コンポーネントの型定義
type GroupSelectProps = {
  value: string | null;
  onChange: (groupId: string | null) => void;
};

/**
 * `GroupSelect` コンポーネント。
 * グループのセレクトボックスを表示し、グループを選択する。
 * @returns {JSX.Element} 選択したグループの UI を返す。
 */
function GroupSelect({ value, onChange }: GroupSelectProps): JSX.Element {
  const { setOpenDialog } = useContacts();
  const {
    groups,
    confirmOpen,
    setConfirmOpen,
    message,
    setMessage,
    messageSeverity,
    setMessageSeverity,
  } = useGroups();
  const submit = useSubmit();
  const navigate = useNavigate();

  /**
   * 削除ボタンを押したときの処理をする関数。
   * @returns {void} この関数は値を返さず、削除ボタンを押したときに呼び出される関数。
   */
  const handleDeleteClick = (): void => {
    setConfirmOpen(true);
  };

  /**
   * 削除処理の実行する関数。
   * @returns {void} この関数は値を返さず、削除処理が実行される。
   */
  const handleConfirmDelete = async (): Promise<void> => {
    if (value) {
      try {
        setOpenDialog(false);
        await submit(null, {
          method: 'delete',
          action: `/groups/delete/${value}`,
        });
        setMessage(MESSAGES.GROUP.DELETE_SUCCESS);
        setMessageSeverity('success');
        navigate(-1);
      } catch {
        setMessage(MESSAGES.GROUP.DELETE_FAIL);
        setMessageSeverity('error');
      }
    }
    setConfirmOpen(false);
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
      <Select
        fullWidth
        value={groups.some((group) => group.id === value) ? value : ''}
        onChange={(e) => onChange(e.target.value || null)}
      >
        <MenuItem value="">GROUPを選択してください</MenuItem>
        {groups.map((group) => (
          <MenuItem key={group.id} value={group.id}>
            {group.name}
          </MenuItem>
        ))}
      </Select>
      <>
        <Button
          variant="outlined"
          size="large"
          component={Link}
          to="/groups/new"
        >
          GROUPを新規作成
        </Button>
        <Button
          variant="outlined"
          size="large"
          component={Link}
          to={value ? `/groups/edit/${value}` : ''}
          disabled={!value}
        >
          GROUPを編集
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={handleDeleteClick}
          disabled={!value}
        >
          GROUPを削除
        </Button>
      </>
      <ConfirmDialog
        open={confirmOpen}
        title="グループ削除確認"
        message={`${MESSAGES.COMMON.CONFIRM_DELETE}`}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

export default GroupSelect;
