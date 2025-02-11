import { useState, useEffect } from 'react';
import useGroups from '../../contexts/useGroups';
import { useNavigate, useParams } from 'react-router';
import { TextField, Button, Typography } from '@mui/material';
// TODO:グループ管理のページ作成

function GroupEdit() {
  const { groups, updateGroup } = useGroups();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    const group = groups.find((g) => g.id === id);
    if (group) setGroupName(group.name);
  }, [id, groups]);

  const handleUpdate = () => {
    const group = groups.find((g) => g.id === id);
    if (group && updateGroup({ ...group, name: groupName })) {
      navigate('/');
    } else {
      alert('既に同じグループ名が存在します');
    }
  };

  return (
    <div>
      <Typography variant="h4">グループを編集</Typography>
      <TextField
        label="グループ名"
        variant="filled"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      <Button onClick={handleUpdate} variant="contained" color="primary">
        更新
      </Button>
    </div>
  );
}
export default GroupEdit;
