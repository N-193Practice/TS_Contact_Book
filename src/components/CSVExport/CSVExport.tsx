import { JSX } from 'react';
import { usePapaParse } from 'react-papaparse';
import useContacts from '../../contexts/useContacts';
import { Button } from '@mui/material';

// TODO:CSVExportの実装(バリデーション)
function CSVExport(): JSX.Element {
  const { contacts } = useContacts();
  const { jsonToCSV } = usePapaParse();

  // 現在の日付と時刻を "yyMMddHHmmss" 形式で取得
  const getFormattedDate = () => {
    const now = new Date();
    const y = String(now.getFullYear()).slice(-2);
    const M = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const H = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    return `${y}${M}${d}${H}${m}${s}`;
  };
  // エクスポートする関数(ローカルストレージから取得→CSVに変換)
  const handleExport = () => {
    const csv = jsonToCSV(contacts, {
      header: true, //オプション設定
      newline: '\r\n',
    });
    // csvダウンロード
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    // バリデーションの実施
    const fileName = `contact_data_${getFormattedDate()}.csv`;
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Button onClick={handleExport}>CSVExport</Button>
    </>
  );
}
export default CSVExport;
