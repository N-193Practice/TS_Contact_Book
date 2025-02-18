import { useState, useEffect, JSX } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useContacts } from '../../contexts/useContacts';
import { useGroups } from '../../contexts/useGroups';
import GroupSelect from '../GroupSelect/GroupSelect';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from '@mui/material';

/**
 * `ContactFormDialog` コンポーネント
 * 連絡先の新規作成および編集用のダイアログ。
 * `useContacts` フックを使用して連絡先情報の追加・編集を管理。
 * @returns {JSX.Element} 連絡先フォームダイアログの UI を返す。
 */

function ContactFormDialog(): JSX.Element {
  const { openDialog, setOpenDialog, editContact, addContact, updateContact } =
    useContacts();
  const { groups, recentlyCreatedGroupId, clearRecentlyCreatedGroupId } =
    useGroups();

  // フォームの状態管理
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [memo, setMemo] = useState<string>('');
  const [groupId, setGroupId] = useState<string | null>(null); // グループID用の state
  const [errorMessage, setErrorMessage] = useState<string>(''); // エラーメッセージ用の state

  /**
   * `editContact` がある場合は編集モードとしてデータをセット。
   * ない場合は新規作成モードとしてリセット。
   * `openDialog` が変わるたびに実行される。
   */
  useEffect(() => {
    const selectedGroup =
      recentlyCreatedGroupId || (editContact ? editContact.groupId : null);
    if (editContact) {
      setName(editContact.name);
      setPhone(editContact.phone);
      setMemo(editContact.memo || '');
      setGroupId(selectedGroup);
    } else {
      setName('');
      setPhone('');
      setMemo('');
      setGroupId(selectedGroup);
    }
    setErrorMessage(''); // ダイアログを開くたびにエラーをリセット
  }, [editContact, openDialog, recentlyCreatedGroupId, groups]);

  /**
   * 保存ボタンを押したときに呼び出される関数
   * @returns {void} 成功時はダイアログを閉じる。
   */
  const handleSave = (): void => {
    // オブジェクトの作成
    const newContact = {
      id: editContact ? editContact.id : uuidv4(),
      name: name.trim(),
      phone: phone.trim(),
      memo: memo.trim(),
      groupId: groupId,
    };
    let success = false;
    if (editContact) {
      success = updateContact(newContact); // 編集処理
    } else {
      success = addContact(newContact); // 新規作成処理
    }
    if (!success) {
      setErrorMessage('入力内容にエラーがあります'); // エラーメッセージを表示
      return;
    }
    clearRecentlyCreatedGroupId();
    setOpenDialog(false); // 成功した場合のみフォームを閉じる
  };

  /**
   * 閉じるボタンを押したときに呼び出される関数。
   * @returns {void} この関数は値を返さず、ダイアログを閉じる。
   */
  const handleClose = () => {
    setOpenDialog(false);
    clearRecentlyCreatedGroupId();
  };

  return (
    <Dialog
      open={openDialog}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      closeAfterTransition={false}
      disableEnforceFocus={true}
      aria-hidden={false}
    >
      <DialogTitle>
        {editContact ? '連絡先を編集' : '新しい連絡先を追加'}
      </DialogTitle>
      <DialogContent>
        {/* エラーがある場合に表示 */}
        {errorMessage && (
          <Typography color="error" variant="body2">
            {errorMessage}
          </Typography>
        )}
        <TextField
          fullWidth
          label="名前"
          variant="filled"
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          fullWidth
          label="電話番号"
          variant="filled"
          margin="normal"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <TextField
          multiline
          fullWidth
          label="メモ"
          variant="filled"
          margin="normal"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />
        <GroupSelect value={groupId} onChange={setGroupId} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>キャンセル</Button>
        <Button onClick={handleSave} color="primary">
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default ContactFormDialog;
