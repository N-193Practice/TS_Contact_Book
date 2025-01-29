import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import Contact from '../models/Contact';
import { saveContacts, getContacts } from '../utils/localStorage';
import { v4 as uuidv4 } from 'uuid';

type ContactFormDialogProps = {
  open: boolean;
  onClose: () => void;
  contact?: Contact | null;
  onSaveSuccess: () => void;
};

function ContactFormDialog({
  open,
  onClose,
  onSaveSuccess,
  contact,
}: ContactFormDialogProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [memo, setMemo] = useState('');

  useEffect(() => {
    if (contact) {
      setName(contact.name);
      setPhone(contact.phone);
      setMemo(contact.memo || '');
    } else {
      setName('');
      setPhone('');
      setMemo('');
    }
  }, [contact]);

  const handleSave = () => {
    if (!name || !phone) {
      alert('名前と電話番号を入力してください');
      return;
    }

    let contacts = getContacts();

    if (contact) {
      // 編集モード
      contacts = contacts.map((c) =>
        c.id === contact.id ? { ...c, name, phone, memo } : c
      );
    } else {
      // 新規登録
      if (contacts.some((c) => c.name === name)) {
        alert('同じ名前の連絡先が既に存在します');
        return;
      }
      contacts.push({ id: uuidv4(), name, phone, memo });
    }

    saveContacts(contacts);
    onSaveSuccess();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {contact ? '連絡先を編集' : '新しい連絡先を追加'}
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
        <Button onClick={onClose} color="secondary">
          キャンセル
        </Button>
        <Button onClick={handleSave} color="primary">
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ContactFormDialog;
