import { JSX } from 'react';
import useGroups from '../../contexts/useGroups';
import { Link } from 'react-router';
import { Select, MenuItem, Button } from '@mui/material';

type GroupSelectProps = {
  value: string | null;
  onChange: (groupId: string | null) => void;
};
function GroupSelect({ value, onChange }: GroupSelectProps): JSX.Element {
  const { groups } = useGroups();

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
          component={Link}
          to="/groups/new"
        >
          Groupを新規作成
        </Button>
        <Button
          variant="outlined"
          size="large"
          component={Link}
          to={value ? `/groups/edit/${value}` : '#'}
          disabled={!value}
        >
          Groupを編集
        </Button>
        <Button
          variant="outlined"
          size="large"
          component={Link}
          to={value ? `/groups/delete/${value}` : '#'}
          disabled={!value}
        >
          Groupを削除
        </Button>
      </>
    </>
  );
}

export default GroupSelect;
