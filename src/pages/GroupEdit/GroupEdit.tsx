import { useState, useEffect, JSX } from 'react';
import { useGroups } from '../../contexts/useGroups';
import { useNavigate, useParams } from 'react-router';
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  InputAdornment,
} from '@mui/material';
import styles from './GroupEdit.module.css';
import Grid from '@mui/material/Grid2';
import AccountCircle from '@mui/icons-material/AccountCircle';

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
    <div className={styles.container}>
      <Paper elevation={3} className={styles.formContainer}>
        <Typography variant="h1" className={styles.title}>
          グループを編集
        </Typography>
        <Box component="form" className={styles.form}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                label="グループ名"
                variant="standard"
                fullWidth
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
          </Grid>
          <Box className={styles.buttonContainer}>
            <Button
              onClick={handleUpdate}
              variant="contained"
              color="primary"
              fullWidth
            >
              更新
            </Button>
            <Button
              onClick={() => navigate('/')}
              variant="outlined"
              color="secondary"
              fullWidth
            >
              キャンセル
            </Button>
          </Box>
        </Box>
      </Paper>
    </div>
  );
}

export default GroupEdit;
