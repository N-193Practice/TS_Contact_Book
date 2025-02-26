import { JSX, useMemo, useState } from 'react';
import { useContacts } from '../../contexts/useContacts';
import ContactList from '../../components/ContactList/ContactList';
import SearchBar from '../../components/SearchBar/SearchBar';
import AlphabetBar from '../../components/AlphabetBar/AlphabetBar';
import ContactFormDialog from '../../components/ContactFormDialog/ContactFormDialog';
import CSVImport from '../../components/CSVImport/CSVImport';
import CSVExport from '../../components/CSVExport/CSVExport';
import styles from './Contacts.module.css';
import { IconButton, Button, Alert, AlertTitle } from '@mui/material';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import Grid from '@mui/material/Grid2';
import { NavLink } from 'react-router';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';

/**
 * `Contacts` コンポーネント(このアプリケーションのホーム画面)
 * 連絡先の一覧画面。ナビゲーション、検索バー、エラーメッセージを表示する。
 * アルファベットフィルター、および連絡先追加・削除機能を提供する。
 * @returns {JSX.Element} ホーム画面の UI を返す。
 */
function Contacts(): JSX.Element {
  const {
    contacts,
    handleNewContact,
    handleDeleteMultiple,
    selectedContacts,
    selectAllContacts,
    deselectAllContacts,
    errorMessage,
    setErrorMessage,
  } = useContacts();

  // 削除確認ダイアログの状態
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const showError = useMemo(() => {
    return errorMessage && errorMessage.length > 0;
  }, [errorMessage]);

  const isAllSelected = useMemo(() => {
    return (
      selectedContacts.length > 0 && selectedContacts.length === contacts.length
    );
  }, [selectedContacts, contacts]);

  /**
   * 削除ボタンを押したときの処理（削除確認ダイアログを開く）
   * @param {string} id - 削除対象の連絡先ID
   */
  const handleDeleteClick = (id: string) => {
    setDeleteTargetId(id);
    setConfirmOpen(true);
  };

  /**
   * 削除確認後の処理（連絡先削除を実行）
   */
  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      handleDeleteMultiple();
      setConfirmOpen(false);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className={styles.container}>
      {/** エラーアラート */}
      <Alert
        className={`${styles.errorAlert} ${showError ? styles.show : ''}`}
        severity="error"
        onClose={() => setErrorMessage('')}
      >
        <AlertTitle>Error</AlertTitle>
        {errorMessage}
      </Alert>
      <header className={styles.header}>
        {/** ヘッダー */}
        <div className={styles.contactsManagement}>
          <div className={styles.searchContacts}>
            {/** 検索バー */}
            <SearchBar />
          </div>
          <div className={styles.newContactButton}>
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
        message="この連絡先を削除してもよろしいですか？"
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default Contacts;
