import { useState, useEffect, useCallback, JSX } from 'react';
import useContacts from '../../contexts/useContacts';
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
import { v4 as uuidv4 } from 'uuid';

/**
 * `ContactFormDialog` コンポーネント
 * 連絡先の新規作成および編集用のダイアログ。
 * `useContacts` フックを使用して連絡先情報の追加・編集を管理。
 * @returns {JSX.Element} 連絡先フォームダイアログの UI を返す。
 */
function ContactFormDialog(): JSX.Element {
  const { openDialog, setOpenDialog, editContact, addContact, updateContact } =
    useContacts();

  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [memo, setMemo] = useState<string>('');
  const [groupId, setGroupId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // ContactFormを開くたびに `localStorage` から復元
  useEffect(() => {
    if (!openDialog) return; // フォームが開いたときだけ処理

    const savedData = localStorage.getItem('contactFormData');

    if (savedData) {
      const { name, phone, memo } = JSON.parse(savedData);
      setName(name);
      setPhone(phone);
      setMemo(memo);
    } else if (editContact) {
      setName(editContact.name);
      setPhone(editContact.phone);
      setMemo(editContact.memo || '');
    } else {
      setName('');
      setPhone('');
      setMemo('');
    }

    setErrorMessage('');
  }, [editContact, openDialog]);

  // フォームを閉じたら `localStorage` のデータを削除
  useEffect(() => {
    if (!openDialog) {
      localStorage.removeItem('contactFormData');
    }
  }, [openDialog]);

  /**
   * 保存ボタンを押したときに実行
   * @returns {void} 成功時はダイアログを閉じる。
   */
  const handleSave = useCallback((): void => {
    const newContact = {
      id: editContact ? editContact.id : uuidv4(),
      name: name.trim(),
      phone: phone.trim(),
      memo: memo.trim(),
      groupId: null, // 仕様上、nullにする
    };

    let success = false;
    if (editContact) {
      success = updateContact(newContact);
    } else {
      success = addContact(newContact);
    }

    if (!success) {
      setErrorMessage('入力内容にエラーがあります');
      return;
    }

    localStorage.removeItem('contactFormData'); // 保存時にデータ削除
    setOpenDialog(false);
  }, [
    editContact,
    name,
    phone,
    memo,
    addContact,
    updateContact,
    setOpenDialog,
  ]);

  return (
    <Dialog
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      maxWidth="sm"
      fullWidth
      closeAfterTransition={false}
    >
      <DialogTitle>
        {editContact ? '連絡先を編集' : '新しい連絡先を追加'}
      </DialogTitle>
      <DialogContent>
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
        <GroupSelect value={groupId} onChange={(value) => setGroupId(value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDialog(false)}>キャンセル</Button>
        <Button onClick={handleSave} color="primary">
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default ContactFormDialog;
