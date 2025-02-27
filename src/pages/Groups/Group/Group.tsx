import { useState, useEffect, JSX } from 'react';
import { useGroups } from '../../../contexts/useGroups';
import styles from './Group.module.css';
import { useNavigate, useLoaderData, useSubmit } from 'react-router';
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
import { GroupDTO } from '../../../utils/contactServices';
import { Group } from '../../../models/types';

/**
 * `GroupのForm` コンポーネント
 * 新規、編集のグループの作成画面を切り替えで表示する。
 * @returns {JSX.Element} グループの作成画面の UI を返す。
 */
function GroupForm(): JSX.Element {
  const submit = useSubmit();
  const navigate = useNavigate();
  const data = useLoaderData() as GroupDTO;

  const [group, setGroup] = useState<Group>({ id: '', name: '' });

  // データの初期化
  useEffect(() => {
    setGroup(data.group || { id: '', name: '' });
  }, [data]);

  const { setErrorMessage, setSuccessMessage } = useGroups();

  // グループ名の変更を反映するためのハンドラー
  function groupNameChangeHandler(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setGroup({ ...group, name: event.target.value });
  }

  /**
   * グループを作成または編集する。
   * グループ名が空の場合はエラーメッセージを表示する。
   * それ以外の場合は、グループを作成または編集する。
   * @returns {void} この関数は値を返さず、変更を反映する。
   */
  const handleSave = (): void => {
    if (!group.name.trim()) {
      setErrorMessage('グループ名を入力してください');
      return;
    }

    if (group.id) {
      // 編集の場合
      setSuccessMessage('グループが更新されました');
      submit(group, { action: `/groups/${group.id}/edit`, method: 'patch' });
    } else {
      // 新規作成の場合
      setSuccessMessage('グループが作成されました');
      submit(group, { action: '/groups/new', method: 'post' });
    }
  };

  return (
    <div className={styles.container}>
      <Paper elevation={3} className={styles.formContainer}>
        <Typography variant="h1" className={styles.title}>
          {group.id ? 'グループを編集' : '新しいグループを作成'}
        </Typography>

        <Box component="form" className={styles.form}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                label="グループ名"
                variant="standard"
                fullWidth
                value={group.name}
                onChange={groupNameChangeHandler}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          <Box className={styles.buttonContainer}>
            <Button
              onClick={handleSave}
              variant="contained"
              color="primary"
              fullWidth
            >
              {group.id ? '更新' : '作成'}
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

export default GroupForm;
