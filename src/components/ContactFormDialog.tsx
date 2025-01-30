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
//TODO: CSSモジュールの定義と、コンポーネントのスタイルを定義する

// ContactFormDialogProps という名前の型を定義する
type ContactFormDialogProps = {
  open: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
  contact: Contact | null;
};

// ContactFormDialogProps 型の引数を受け取る ContactFormDialog コンポーネントを定義する
function ContactFormDialog({
  open,
  onClose,
  onSaveSuccess,
  contact,
}: ContactFormDialogProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [memo, setMemo] = useState('');

  // contact が存在する場合は初期値を設定する
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

  // 入力された名前と電話番号が正しいかチェックする
  const validateInput = () => {
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName || !trimmedPhone) {
      alert('名前と電話番号は必須です');
      return false;
    }

    const contacts = getContacts();

    if (!contact) {
      // 新規登録の場合
      if (contacts.some((c) => c.name === trimmedName)) {
        alert('この名前の連絡先は既に存在します');
        return false;
      }
    }
    return true;
  };

  // 保存ボタンを押したときに呼び出される関数
  const handleSave = () => {
    if (!validateInput()) return;

    let contacts = getContacts();
    const newContact: Contact = {
      id: contact ? contact.id : uuidv4(),
      name,
      phone,
      memo,
    };

    if (contact) {
      // 編集モード
      contacts = contacts.map((c) => (c.id === contact.id ? newContact : c));
    } else {
      // 新規登録
      contacts.push(newContact);
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
        <Button onClick={onClose}>キャンセル</Button>
        <Button onClick={handleSave} color="primary">
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ContactFormDialog;
