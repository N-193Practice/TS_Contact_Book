import { JSX } from 'react';
import { useGroups } from '../../contexts/useGroups';
import { Link } from 'react-router';
import { Select, MenuItem, Button } from '@mui/material';

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

  return (
    <>
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
      </>
    </>
  );
}

export default GroupSelect;
