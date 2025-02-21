import { useState, JSX } from 'react';
import { useGroups } from '../../contexts/useGroups';
import styles from './GroupNew.module.css';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router';
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  InputAdornment,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import AccountCircle from '@mui/icons-material/AccountCircle';

/**
 * `GroupNew` コンポーネント
 * 新規グループの作成画面。
 * @returns {JSX.Element} 新規グループの作成画面の UI を返す。
 */
function GroupNew(): JSX.Element {
  const { addGroup } = useGroups();
  const [groupName, setGroupName] = useState('');
  const navigate = useNavigate();

  /**
   * 新規グループを作成する。
   * @returns {void} 成功時はグループを作成し、ホームへ遷移する。
   */
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
    <div className={styles.container}>
      <Paper elevation={3} className={styles.formContainer}>
        <Typography variant="h1" className={styles.title}>
          新しいグループを作成
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
              onClick={handleCreate}
              variant="contained"
              color="primary"
              fullWidth
            >
              作成
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

export default GroupNew;
