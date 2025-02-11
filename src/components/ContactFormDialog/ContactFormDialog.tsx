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
 * 連絡先の新規作成および編集用のダイアログ。フォームの入力をローカルストレージに保存する。
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

  // フォームの状態管理
  useEffect(() => {
    const savedData = localStorage.getItem('contactFormData');
    if (savedData) {
      const { name, phone, memo, groupId } = JSON.parse(savedData);
      setName(name);
      setPhone(phone);
      setMemo(memo);
      setGroupId(groupId);
      localStorage.removeItem('contactFormData');
    } else if (editContact) {
      setName(editContact.name);
      setPhone(editContact.phone);
      setMemo(editContact.memo || '');
      setGroupId(editContact.groupId);
    } else {
      setName('');
      setPhone('');
      setMemo('');
      setGroupId(null);
    }
    setErrorMessage('');
  }, [editContact, openDialog]);

  const handleSave = useCallback((): void => {
    const newContact = {
      id: editContact ? editContact.id : uuidv4(),
      name: name.trim(),
      phone: phone.trim(),
      memo: memo.trim(),
      groupId: groupId,
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
    setOpenDialog(false);
  }, [
    editContact,
    name,
    phone,
    memo,
    groupId,
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
