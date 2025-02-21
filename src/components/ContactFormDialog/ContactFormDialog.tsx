import { useState, useEffect, JSX } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useContacts } from '../../contexts/useContacts';
import { useGroups } from '../../contexts/useGroups';
import { validateContact } from '../../utils/validation';
import GroupSelect from '../GroupSelect/GroupSelect';
import NotificationBanner from '../NotificationBanner/NotificationBanner';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';

/**
 * `ContactFormDialog` コンポーネント
 * 連絡先の新規作成および編集用のダイアログ。
 */
function ContactFormDialog(): JSX.Element {
  const {
    openDialog,
    setOpenDialog,
    editContact,
    addContact,
    updateContact,
    errorMessage,
    setErrorMessage,
    successMessage,
    setSuccessMessage,
  } = useContacts();
  const { groups, recentlyCreatedGroupId, clearRecentlyCreatedGroupId } =
    useGroups();

  // フォームの状態管理
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [memo, setMemo] = useState<string>('');
  const [groupId, setGroupId] = useState<string | null>(null);

  /**
   * `editContact` がある場合は編集モードとしてデータをセット。
   * ない場合は新規作成モードとしてリセット。
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
    setErrorMessage(null); // ダイアログを開くたびにエラーをリセット
    setSuccessMessage(null); // 成功メッセージもリセット
  }, [
    editContact,
    openDialog,
    recentlyCreatedGroupId,
    groups,
    setErrorMessage,
    setSuccessMessage,
  ]);

  /**
   * 保存ボタンを押したときに呼び出される関数
   */
  const handleSave = (): void => {
    const newContact = {
      id: editContact ? editContact.id : uuidv4(),
      name: name.trim(),
      phone: phone.trim(),
      memo: memo.trim(),
      groupId: groupId,
    };

    // バリデーションを実行 (エラー時は `setErrorMessage` に渡す)
    const isValid = validateContact(
      newContact,
      [],
      !!editContact,
      setErrorMessage
    );
    if (!isValid) return;

    let success = false;
    if (editContact) {
      success = updateContact(newContact); // 編集処理
    } else {
      success = addContact(newContact); // 新規作成処理
    }

    if (!success) {
      setErrorMessage('入力内容にエラーがあります');
      return;
    }

    setSuccessMessage(
      editContact ? '連絡先を更新しました' : '新しい連絡先を追加しました'
    );
    clearRecentlyCreatedGroupId();
    setOpenDialog(false); // 成功した場合のみフォームを閉じる
  };

  /**
   * 閉じるボタンを押したときに呼び出される関数。
   * @returns {void} この関数はフォームを閉じ、フォームをリセットする。
   */
  const handleClose = (): void => {
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
