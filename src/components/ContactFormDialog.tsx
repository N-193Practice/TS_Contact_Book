import React, { useState, useEffect } from 'react';
import { useContacts } from '../contexts/ContactContext';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

function ContactFormDialog() {
  const {
    openDialog,
    setOpenDialog,
    editContact,
    addContact,
    updateContact,
    contacts,
  } = useContacts();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [memo, setMemo] = useState('');

  // `editContact` がある場合はデータをセット、それ以外はリセット
  useEffect(() => {
    if (editContact) {
      setName(editContact.name);
      setPhone(editContact.phone);
      setMemo(editContact.memo || '');
    } else {
      setName('');
      setPhone('');
      setMemo('');
    }
  }, [editContact, openDialog]);

  // 入力バリデーション
  const validateInput = () => {
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName || !trimmedPhone) {
      alert('名前と電話番号は必須です');
      return false;
    }

    // 名前の重複チェック（新規登録時のみ）
    if (!editContact && contacts.some((c) => c.name === trimmedName)) {
      alert('この名前の連絡先はすでに存在します');
      return false;
    }

    return true;
  };

  // 保存ボタンを押したときに呼び出される関数
  const handleSave = () => {
    if (!validateInput()) return;

    const newContact = {
      id: editContact ? editContact.id : uuidv4(),
      name: name.trim(),
      phone: phone.trim(),
      memo: memo.trim(),
    };

    if (editContact) {
      updateContact(newContact); // 既存データの更新
    } else {
      addContact(newContact); // 新規データの追加
    }

    setOpenDialog(false);
  };

  return (
    <Dialog
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {editContact ? '連絡先を編集' : '新しい連絡先を追加'}
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="名前"
          variant="outlined"
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          fullWidth
          label="電話番号"
          variant="outlined"
          margin="normal"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <TextField
          fullWidth
          label="メモ"
          variant="outlined"
          margin="normal"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />
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
