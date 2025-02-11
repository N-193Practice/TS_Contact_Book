import { useState } from 'react';
import useGroups from '../../contexts/useGroups';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router';
import { TextField, Button, Typography } from '@mui/material';
// TODO:グループ管理のページ作成

function GroupNew() {
  const { addGroup } = useGroups();
  const [groupName, setGroupName] = useState('');
  const navigate = useNavigate();

  // 新規グループの作成
  const handleCreate = () => {
    if (!groupName.trim()) {
      alert('グループ名を入力してください');
      return;
    }

    const newGroup = { id: uuidv4(), name: groupName.trim() };
    if (addGroup(newGroup)) {
      navigate('/');
    } else {
      alert('既に同じグループ名が存在します');
    }
  };

  return (
    <div>
      <Typography variant="h4">新しいグループを作成</Typography>
      <TextField
        label="グループ名"
        variant="filled"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      <Button onClick={handleCreate} variant="contained" color="primary">
        作成
      </Button>
    </div>
  );
}

export default GroupNew;
