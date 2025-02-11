import { JSX, useCallback } from 'react';
import useGroups from '../../contexts/useGroups';
import { useNavigate } from 'react-router';
import { Select, MenuItem, Button } from '@mui/material';

type GroupSelectProps = {
  value: string | null;
  onChange: (groupId: string | null) => void;
};

/**
 * `GroupSelect` コンポーネント
 * グループのセレクトボックスを表示し、グループを選択する。
 * @param {GroupSelectProps} props - `value` を受け取る。
 * @returns {JSX.Element} グループセレクトボックスの UI を返す。
 */
function GroupSelect({ value, onChange }: GroupSelectProps): JSX.Element {
  const { groups } = useGroups();
  const navigate = useNavigate();

  /**
   * グループの新規作成・編集・削除ボタンを押したときにフォームの入力情報をローカルストレージに保存する。
   * @param {string} path - 画面遷移先のパス
   * @returns {void} この関数は値を返さず、ページ遷移する。
   */
  const handleGroupAction = useCallback(
    (path: string) => {
      // フォームの現在のデータを取得
      const currentData = {
        name:
          (document.querySelector('input[label="名前"]') as HTMLInputElement)
            ?.value || '',
        phone:
          (
            document.querySelector(
              'input[label="電話番号"]'
            ) as HTMLInputElement
          )?.value || '',
        memo:
          (
            document.querySelector(
              'textarea[label="メモ"]'
            ) as HTMLTextAreaElement
          )?.value || '',
        groupId: value,
      };

      // `localStorage` に保存
      localStorage.setItem('contactFormData', JSON.stringify(currentData));

      // ページ遷移
      navigate(path);
    },
    [value, navigate]
  );

  return (
    <>
      <Select
        fullWidth
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || null)}
      >
        <MenuItem value="">未作成</MenuItem>
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
          onClick={() => handleGroupAction('/groups/new')}
        >
          GROUPを新規作成
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={() => handleGroupAction(`/groups/edit/${value}`)}
          disabled={!value}
        >
          GROUPを編集
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={() => handleGroupAction(`/groups/delete/${value}`)}
          disabled={!value}
        >
          GROUPを削除
        </Button>
      </>
    </>
  );
}

export default GroupSelect;
