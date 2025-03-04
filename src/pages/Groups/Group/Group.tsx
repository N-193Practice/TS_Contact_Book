import { useState, useEffect, JSX } from 'react';
import { useGroups } from '../../../contexts/useGroups';
import { MESSAGES } from '../../../utils/message';
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
import { validateGroup } from '../../../utils/validation';

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

  const { groups, setSuccessMessage, setErrorMessage } = useGroups();
  const [errorName, setErrorName] = useState<string>('');

  // データの初期化
  useEffect(() => {
    setGroup(data.group || { id: '', name: '' });
  }, [data]);

  /**
   * `グループ名` の変更イベントハンドラ
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} event - イベントオブジェクト
   * @returns {void} この関数は値を返さず、変更を反映する。
   */
  const groupNameChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newName = event.target.value;
    setGroup({ ...group, name: newName });

    // 入力時にリアルタイムでバリデーション
    validateGroup(
      { ...group, name: newName },
      groups,
      !!group.id,
      setErrorName
    );
  };

  /**
   * グループを作成または編集する。
   * グループ名が空の場合はエラーメッセージを表示する。
   * それ以外の場合は、グループを作成または編集する。
   * @returns {void} この関数は値を返さず、変更を反映する。
   */
  const handleSave = async (): Promise<void> => {
    if (!validateGroup(group, groups, !!group.id, setErrorName)) {
      setErrorMessage(MESSAGES.GROUP.NAME_REQUIRED);
      return;
    }
    if (group.id) {
      try {
        await submit(group, {
          action: `/groups/edit/${group.id}`,
          method: 'patch',
        });
        setSuccessMessage(MESSAGES.GROUP.UPDATE_SUCCESS);
      } catch {
        setErrorMessage(MESSAGES.GROUP.UPDATE_ERROR);
      }
    } else {
      try {
        await submit(group, { action: '/groups/new', method: 'post' });
        setSuccessMessage(MESSAGES.GROUP.CREATE_SUCCESS);
      } catch {
        setErrorMessage(MESSAGES.GROUP.CREATE_ERROR);
      }
    }
    navigate('/groups');
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
                error={!!errorName}
                helperText={errorName}
                label="グループ名"
                variant="standard"
                fullWidth
                value={group.name}
                onChange={groupNameChangeHandler}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    ),
                  },
                }}
                onBlur={() =>
                  validateGroup(group, groups, !!group.id, setErrorName)
                }
              />
            </Grid>
          </Grid>

          <Box className={styles.buttonContainer}>
            <Button
              onClick={handleSave}
              variant="contained"
              color="primary"
              fullWidth
              disabled={!!errorName} // エラーがある場合はボタンを無効化
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
