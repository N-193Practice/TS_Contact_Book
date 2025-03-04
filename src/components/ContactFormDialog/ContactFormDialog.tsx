import { useState, useEffect, JSX } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useContacts } from '../../contexts/useContacts';
import { useGroups } from '../../contexts/useGroups';
import {
  validateContact,
  validateName,
  validatePhone,
} from '../../utils/validation';
import { MESSAGES } from '../../utils/message';
import GroupSelect from '../GroupSelect/GroupSelect';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { useNavigate, useSubmit } from 'react-router';

/**
 * `ContactFormDialog` コンポーネント
 * 連絡先の新規作成および編集用のダイアログ。
 */
function ContactFormDialog(): JSX.Element {
  const {
    openDialog,
    setOpenDialog,
    editContact,
    setErrorMessage,
    setSuccessMessage,
  } = useContacts();

  const submit = useSubmit();
  const navigate = useNavigate();

  const { groups, recentlyCreatedGroupId, clearRecentlyCreatedGroupId } =
    useGroups();

  // フォームの状態管理
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [memo, setMemo] = useState<string>('');
  const [groupId, setGroupId] = useState<string | null>(null);

  const [errorName, setErrorName] = useState<string>('');
  const [errorPhone, setErrorPhone] = useState<string>('');

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
      setGroupId('');
    }
    setErrorMessage(null); // ダイアログを開くたびにエラーをリセット
    setSuccessMessage(null); // 成功メッセージもリセット
  }, [
    editContact,
    openDialog,
    groups,
    recentlyCreatedGroupId,
    setErrorMessage,
    setSuccessMessage,
  ]);

  /**
   * 保存ボタンを押したときに呼び出される関数
   * @returns {void} この関数は値を返さず、ダイアログを開くだけ。
   */
  const handleSave = async (): Promise<void> => {
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

    try {
      if (editContact && editContact.id !== '') {
        await submit(newContact, {
          action: '/',
          method: 'patch',
          encType: 'application/json',
        });
        setSuccessMessage(MESSAGES.CONTACT.UPDATE_SUCCESS);
      } else {
        await submit(newContact, {
          action: '/',
          method: 'post',
          encType: 'application/json',
        });
        setSuccessMessage(MESSAGES.CONTACT.CREATE_SUCCESS);
      }
      clearRecentlyCreatedGroupId();
      setOpenDialog(false); // 成功した場合のみフォームを閉じる
    } catch {
      setErrorMessage(MESSAGES.CONTACT.CREATE_ERROR);
      return;
    }
  };

  /**
   * 閉じるボタンを押したときに呼び出される関数。
   * @returns {void} この関数はフォームを閉じ、フォームをリセットする。
   */
  const handleClose = (): void => {
    setOpenDialog(false);
    clearRecentlyCreatedGroupId();
    navigate('/');
  };

  return (
    <Dialog
      open={openDialog}
      onClose={handleClose}
      maxWidth="sm"
      closeAfterTransition={false}
      disableEnforceFocus={true}
      aria-hidden={false}
    >
      <DialogTitle>
        {editContact && editContact.id !== ''
          ? '連絡先を編集'
          : '新しい連絡先を追加'}
      </DialogTitle>
      <DialogContent>
        <TextField
          error={!!errorName}
          helperText={errorName}
          fullWidth
          label="名前"
          variant="filled"
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => validateName(name, setErrorName)}
        />
        <TextField
          error={!!errorPhone}
          helperText={errorPhone}
          fullWidth
          label="電話番号"
          variant="filled"
          margin="normal"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onBlur={() => validatePhone(phone, setErrorPhone)}
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
