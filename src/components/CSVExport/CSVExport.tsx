import { useState, JSX } from 'react';
import { usePapaParse } from 'react-papaparse';
import useContacts from '../../contexts/useContacts';
import useGroups from '../../contexts/useGroups';
import { CSVContact } from '../../models/types';
import { contactToCSV } from '../../utils/csvConverter';
import { validateContact } from '../../utils/validation';
import { Button } from '@mui/material';

/**
 * `CSVExport` コンポーネント。
 * 連絡先をCSVファイルにエクスポートする。(Contact → CSVContact)
 * @returns {JSX.Element} エクスポートした場合は UI を返す。
 */
function CSVExport(): JSX.Element {
  const { contacts } = useContacts();
  const { groups } = useGroups();
  const { jsonToCSV } = usePapaParse();
  const [errors, setErrors] = useState<string[]>([]);

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

  //
  /**
   * エクスポートする関数(ローカルストレージから取得→CSVに変換)
   * @returns {void} この関数は値を返さず、ローカルストレージからファイルを読み込む際に呼び出される。
   */
  const handleExport = (): void => {
    const newErrors: string[] = [];
    const validContacts: CSVContact[] = contacts
      .filter((contact, index) => {
        if (!validateContact(contact, contacts, true)) {
          newErrors.push(
            `Row ${index + 1}: 不正なデータを含むためエクスポートされません`
          );
          return false;
        }
        return true;
      })
      .map((contact) => contactToCSV(contact, groups));

    setErrors(newErrors);

    if (validContacts.length === 0) {
      alert('エクスポート可能なデータがありません');
      return;
    }

    // CSVに変換してダウンロードする
    let csv = jsonToCSV(validContacts, {
      header: true, //オプション設定
      newline: '\r\n',
      columns: ['contactId', 'groupName', 'fullName', 'phone', 'memo'],
    });

    csv = '\uFEFF' + csv; //Excel で開いたときの文字化けを防止する
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    // ファイルの生成
    const fileName = `contact_data_${getFormattedDate()}.csv`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Button onClick={handleExport}>CSVExport</Button>
      {errors.length > 0 && (
        <div style={{ color: 'red' }}>
          <h4>バリデーションエラー:</h4>
          <ul>
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default CSVExport;
