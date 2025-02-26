import { useState, JSX } from 'react';
import { useGroups } from '../../../contexts/useGroups';
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
import NotificationBanner from '../../../components/NotificationBanner/NotificationBanner';

/**
 * `GroupNew` コンポーネント
 * 新規グループの作成画面。
 * @returns {JSX.Element} 新規グループの作成画面の UI を返す。
 */
function GroupNew(): JSX.Element {
  const {
    addGroup,
    reloadGroups,
    errorMessage,
    setErrorMessage,
    successMessage,
    setSuccessMessage,
  } = useGroups();
  const [groupName, setGroupName] = useState('');
  const navigate = useNavigate();
  /**
   * 新規グループを作成する。
   * @returns {void} 成功時はグループを作成し、ホームへ遷移する。
   */
  const handleCreate = (): void => {
    if (!groupName.trim()) {
      setErrorMessage('グループ名を入力してください');
      return;
    }

    const newGroup = { id: uuidv4(), name: groupName.trim() };
    if (addGroup(newGroup)) {
      setSuccessMessage('グループが作成されました');
      reloadGroups();
      setTimeout(() => navigate('/groups'), 2000);
    } else {
      console.log('🚀 addGroup:', addGroup);
      setErrorMessage('既に同じグループ名が存在します');
    }
  };

  return (
    <div className={styles.container}>
      {/* エラー表示 */}
      {errorMessage && (
        <NotificationBanner
          message={errorMessage}
          severity="error"
          onClose={() => setErrorMessage(null)}
        />
      )}
      {/* 成功メッセージ */}
      {successMessage && (
        <NotificationBanner
          message={successMessage}
          severity="success"
          onClose={() => setSuccessMessage(null)}
        />
      )}
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
              onClick={() => navigate(-1)}
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
