import { JSX, useState } from 'react';
import { useGroups } from '../../contexts/useGroups';
import { Link } from 'react-router';
import { Select, MenuItem, Button } from '@mui/material';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import NotificationBanner from '../../components/NotificationBanner/NotificationBanner';
import { MESSAGES } from '../../utils/message';
import { useSubmit } from 'react-router';

// GroupSelect コンポーネントの型定義
type GroupSelectProps = {
  value: string | null;
  onChange: (groupId: string | null) => void;
};

/**
 * `GroupSelect` コンポーネント。(グループ機能は一覧画面から行うことを想定)
 * グループのセレクトボックスを表示し、グループを選択する。
 * @returns {JSX.Element} 選択したグループの UI を返す。
 */
function GroupSelect({ value, onChange }: GroupSelectProps): JSX.Element {
  const { groups } = useGroups();
  const submit = useSubmit();

  // 削除確認ダイアログの状態
  const [confirmOpen, setConfirmOpen] = useState(false);

  // 通知メッセージの状態
  const [message, setMessage] = useState<string | null>(null);
  const [messageSeverity, setMessageSeverity] = useState<
    'success' | 'error' | 'info'
  >('info');

  /**
   * 削除ボタンを押したときの処理をする関数。
   * @param {string} id - 削除対象のグループID。
   * @returns {void} この関数は値を返さず、削除ボタンを押したときに呼び出される関数。
   */
  const handleDeleteClick = (): void => {
    setConfirmOpen(true);
  };

  /**
   * 削除処理の実行する関数。
   * @returns {void} この関数は値を返さず、削除処理が実行される。
   */
  const handleConfirmDelete = (): void => {
    if (value) {
      submit(null, {
        method: 'delete',
        action: `/groups/delete/${value}`,
      });

      setMessage(MESSAGES.GROUP.DELETE_SUCCESS);
      setMessageSeverity('success');
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
        message="このグループを削除してもよろしいですか？"
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

export default GroupSelect;
