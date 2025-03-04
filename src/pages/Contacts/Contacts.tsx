import { JSX, useEffect, useMemo, useState } from 'react';
import { useContacts } from '../../contexts/useContacts';
import ContactList from '../../components/ContactList/ContactList';
import SearchBar from '../../components/SearchBar/SearchBar';
import AlphabetBar from '../../components/AlphabetBar/AlphabetBar';
import ContactFormDialog from '../../components/ContactFormDialog/ContactFormDialog';
import CSVImport from '../../components/CSVImport/CSVImport';
import CSVExport from '../../components/CSVExport/CSVExport';
import styles from './Contacts.module.css';
import { IconButton, Button } from '@mui/material';
import NotificationBanner from '../../components/NotificationBanner/NotificationBanner';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import Grid from '@mui/material/Grid2';
import { NavLink, useLoaderData } from 'react-router';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import { ContactsDTO } from '../../utils/contactServices';
import { MESSAGES } from '../../utils/message';
import { useGroups } from '../../contexts/useGroups';

/**
 * `Contacts` コンポーネント(このアプリケーションのホーム画面)
 * 連絡先の一覧画面。ナビゲーション、検索バー、エラーメッセージを表示する。
 * アルファベットフィルター、および連絡先追加・削除機能を提供する。
 * @returns {JSX.Element} ホーム画面の UI を返す。
 */
function Contacts(): JSX.Element {
  const {
    contacts,
    setContacts,
    setEditContact,
    setOpenDialog,
    handleNewContact,
    handleDeleteMultiple,
    selectedContacts,
    selectAllContacts,
    deselectAllContacts,
    errorMessage,
    setErrorMessage,
    successMessage,
    setSuccessMessage,
  } = useContacts();

  const { setGroups } = useGroups();

  const contactsData: ContactsDTO = useLoaderData();

  // 連絡先データの状態を更新する。
  useEffect(() => {
    if (contactsData.contacts) {
      setContacts(contactsData.contacts);
    }
    if (contactsData.groups) {
      setGroups(contactsData.groups);
    }
  }, [contactsData.contacts, contactsData.groups, setGroups, setContacts]);

  // 連絡先編集ダイアログの状態
  useEffect(() => {
    if (contactsData.selectedContact) {
      setEditContact(contactsData.selectedContact);
      setGroups(contactsData.groups);
      setOpenDialog(true);
    }
  }, [
    contactsData.selectedContact,
    contactsData.groups,
    setEditContact,
    setOpenDialog,
    setGroups,
  ]);

  // 削除確認ダイアログの状態
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // 通知メッセージの状態
  const [message, setMessage] = useState<string | null>(null);
  const [messageSeverity, setMessageSeverity] = useState<
    'success' | 'error' | 'info'
  >('info');

  // 通知メッセージの設定
  useEffect(() => {
    if (successMessage) {
      setMessage(successMessage);
      setMessageSeverity('success');
      setSuccessMessage(null);
    }
    if (errorMessage) {
      setMessage(errorMessage);
      setMessageSeverity('error');
      setErrorMessage(null);
    }
  }, [successMessage, errorMessage, setSuccessMessage, setErrorMessage]);

  // 全選択ボタンの状態
  const isAllSelected = useMemo(() => {
    return (
      selectedContacts.length > 0 && selectedContacts.length === contacts.length
    );
  }, [selectedContacts, contacts]);

  /**
   * 削除ボタンを押したときの処理（削除確認ダイアログを開く）
   * @param {string} id - 削除対象の連絡先ID
   * @returns {void} この関数は値を返さず、削除ボタンを押したときに呼び出される関数。
   */
  const handleDeleteClick = (id: string): void => {
    setDeleteTargetId(id);
    setConfirmOpen(true);
  };

  /**
   * 削除確認後の処理（連絡先削除を実行）
   * @returns {void} この関数は値を返さず、削除確認ダイアログを閉じる。
   */
  const handleConfirmDelete = (): void => {
    if (deleteTargetId) {
      handleDeleteMultiple();
      setConfirmOpen(false);
      setDeleteTargetId(null);
      setMessage(MESSAGES.CONTACT.DELETE_SUCCESS);
      setMessageSeverity('success');
    }
  };

  return (
    <div className={styles.container}>
      {/** エラーアラート */}
      {message && (
        <NotificationBanner
          message={message}
          severity={messageSeverity}
          onClose={() => setMessage(null)}
        />
      )}
      <header className={styles.header}>
        {/** ヘッダー */}
        <div className={styles.contactsManagement}>
          <div className={styles.searchContacts}>
            {/** 検索バー */}
            <SearchBar />
            {/** 新規連絡先作成ボタン */}
            <IconButton
              aria-label="新規作成"
              onClick={handleNewContact}
              className={styles.iconButton}
              component={NavLink}
              to={'/contacts/new'}
            >
              <PersonAddAlt1Icon
                className={styles.addContactIcon}
                focusable="false"
              />
            </IconButton>
          </div>
          <div className={styles.newContactButton}></div>
          <div className={styles.contactsImportExport}>
            {/* CSVインポートボタン */}
            <CSVImport />
            {/* CSVエクスポートボタン */}
            <CSVExport />
          </div>
        </div>
        <div className={styles.contactListController}>
          {/** 連絡先一括削除ボタン */}
          <Button
            variant="contained"
            onClick={() => handleDeleteClick(selectedContacts[0])}
            disabled={selectedContacts.length === 0}
            className={styles.deleteButton}
            color="error"
          >
            連絡先一括削除
          </Button>
          {/** 連絡先全選択 */}
          <Button
            variant="outlined"
            onClick={selectAllContacts}
            disabled={isAllSelected}
            className={styles.selectAllButton}
          >
            連絡先の全選択
          </Button>
          {/** 連絡先全選択解除ボタン */}
          <Button
            variant="outlined"
            onClick={deselectAllContacts}
            disabled={selectedContacts.length === 0}
            className={styles.deselectAllButton}
          >
            全選択の解除
          </Button>
        </div>
      </header>
      {/* main */}
      <Grid className={styles.contactsContainer}>
        {/* 連絡先リスト */}
        <ContactList />
      </Grid>
      <Grid className={styles.alphabetContainer}>
        {/* アルファベットナビゲーションバー */}
        <AlphabetBar />
      </Grid>
      {/* 連絡先追加・編集用ダイアログ */}
      <ContactFormDialog />
      {/* 削除確認ダイアログ */}
      <ConfirmDialog
        open={confirmOpen}
        title="連絡先削除確認"
        message={`${MESSAGES.COMMON.CONFIRM_DELETE}`}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default Contacts;
