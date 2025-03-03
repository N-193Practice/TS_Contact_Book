import { JSX } from 'react';
import { usePapaParse } from 'react-papaparse';
import { useContacts } from '../../contexts/useContacts';
import { useGroups } from '../../contexts/useGroups';
import { CSVContact } from '../../models/types';
import { contactToCSV } from '../../utils/csvConverter';
import { Button } from '@mui/material';
import styles from './CSVExport.module.css';
import { MESSAGES } from '../../utils/message';

/**
 * `CSVExport` コンポーネント。
 * 連絡先をCSVファイルにエクスポートする。(Contact → CSVContact)
 * @returns {JSX.Element} エクスポートした場合は UI を返す。
 */
function CSVExport(): JSX.Element {
  const { contacts, setErrorMessage, setSuccessMessage } = useContacts();
  const { groups } = useGroups();
  const { jsonToCSV } = usePapaParse();

  /**
   * 現在の日付と時刻を "yyMMddHHmmss" 形式で取得
   * @returns {string} "yyMMddHHmmss" 形式の日付と時刻を返す。
   */
  const getFormattedDate = (): string => {
    const now = new Date();
    const y = String(now.getFullYear()).slice(-2);
    const M = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const H = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    return `${y}${M}${d}${H}${m}${s}`;
  };

  /**
   * エクスポートする関数(ローカルストレージから取得→CSVに変換)
   * @returns {void} この関数は値を返さず、ローカルストレージからファイルを読み込む際に呼び出される。
   */
  const handleExport = (): void => {
    if (contacts.length === 0) {
      setErrorMessage(MESSAGES.CSV.NO_DATA_IN_FILE);
      return;
    }

    // データの変換(Contact→CSVContact)
    const csvContacts: CSVContact[] = contacts.map((contact) =>
      contactToCSV(contact, groups)
    );

    // バリデーションチェック
    const validContacts: CSVContact[] = csvContacts.filter(
      (csvContact) => csvContact.fullName && csvContact.phone
    );

    if (validContacts.length === 0) {
      setErrorMessage(MESSAGES.CSV.VALIDATION_ERROR);
      return;
    }

    // CSV に変換してダウンロード
    let csv = jsonToCSV(validContacts, {
      header: true,
      newline: '\r\n',
      columns: ['contactId', 'fullName', 'phone', 'memo', 'groupName'],
    });

    csv = '\uFEFF' + csv; // Excel の文字化け対策
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' }); //CSVダウンロード用のBlobを作成
    const link = document.createElement('a'); //Blobをダウンロードするためのリンクを作成
    link.href = URL.createObjectURL(blob);
    const fileName = `contact_data_${getFormattedDate()}.csv`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSuccessMessage(`${MESSAGES.CSV.EXPORT_SUCCESS} (${fileName})`);
  };

  return (
    <>
      <Button
        className={styles.exportButton}
        variant="contained"
        component="label"
        onClick={handleExport}
      >
        データを出力する
      </Button>
    </>
  );
}

export default CSVExport;
