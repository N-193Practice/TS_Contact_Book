import { JSX } from 'react';
import { usePapaParse } from 'react-papaparse';
import { useContacts } from '../../contexts/useContacts';
import { useGroups } from '../../contexts/useGroups';
import { CSVContact } from '../../models/types';
import { contactToCSV } from '../../utils/csvConverter';
import { Button } from '@mui/material';

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
    console.log('エクスポート前のデータ:', contacts);

    if (contacts.length === 0) {
      setErrorMessage('エクスポートできる連絡先がありません');
      return;
    }

    const csvContacts: CSVContact[] = contacts.map((contact) =>
      contactToCSV(contact, groups)
    );

    console.log('変換後の CSVContacts:', csvContacts);

    // バリデーションチェック
    const validContacts: CSVContact[] = csvContacts.filter(
      (csvContact) => csvContact.fullName && csvContact.phone
    );

    if (validContacts.length === 0) {
      setErrorMessage('有効なデータがないため、エクスポートを中断しました');
      return;
    }

    // CSV に変換してダウンロード
    let csv = jsonToCSV(validContacts, {
      header: true,
      newline: '\r\n',
      columns: ['contactId', 'fullName', 'phone', 'memo', 'groupName'],
    });

    csv = '\uFEFF' + csv; // Excel の文字化け対策
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const fileName = `contact_data_${getFormattedDate()}.csv`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSuccessMessage(`CSVエクスポートが完了しました！ (${fileName})`);
  };

  return (
    <>
      <Button color="primary" onClick={handleExport}>
        データを出力する
      </Button>
    </>
  );
}

export default CSVExport;
