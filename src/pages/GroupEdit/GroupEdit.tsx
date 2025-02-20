import { useState, useEffect, JSX } from 'react';
import { useGroups } from '../../contexts/useGroups';
import { useNavigate, useParams } from 'react-router';
import { TextField, Button, Typography } from '@mui/material';

/**
 * `GroupEdit` コンポーネント
 * グループの編集画面。
 * @returns {JSX.Element} グループの編集画面の UI を返す。
 */
function GroupEdit(): JSX.Element {
  const { groups, updateGroup } = useGroups();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState('');

  // グループの名前を取得する
  useEffect(() => {
    const group = groups.find((g) => g.id === id);
    if (group) setGroupName(group.name);
  }, [id, groups]);

  /**
   * グループを更新する。
   * @returns {void} 成功時はグループを更新し、ホームへ遷移する。
   */
  const handleUpdate = (): void => {
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
      <Button
        onClick={() => navigate('/')}
        variant="contained"
        color="secondary"
      >
        キャンセル
      </Button>
    </div>
  );
}

export default GroupEdit;
