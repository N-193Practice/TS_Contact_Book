import { useState, useEffect } from 'react';
import { useContacts } from '../../contexts/useContacts';
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

  // フォームの状態管理
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [memo, setMemo] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // エラーメッセージ用の state

  /**
   * `editContact` がある場合は編集モードとしてデータをセット。
   * ない場合は新規作成モードとしてリセット。
   * `openDialog` が変わるたびに実行される。
   */
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
    setErrorMessage(''); // ダイアログを開くたびにエラーをリセット
  }, [editContact, openDialog]);

  // 保存ボタンを押したときに呼び出される関数
  const handleSave = () => {
    // 新規作成または編集のデータを作成する。
    const newContact = {
      id: editContact ? editContact.id : uuidv4(),
      name: name.trim(),
      phone: phone.trim(),
      memo: memo.trim(),
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
    setOpenDialog(false); // 成功した場合のみフォームを閉じる
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
          fullWidth
          label="メモ"
          variant="filled"
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
