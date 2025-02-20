import { useState, JSX } from 'react';
import { usePapaParse } from 'react-papaparse';
import { useContacts } from '../../contexts/useContacts';
import { useGroups } from '../../contexts/useGroups';
import { CSVContact } from '../../models/types';
import { contactToCSV } from '../../utils/csvConverter';
import {
  validateContactData,
  ValidatableContact,
} from '../../utils/validation';
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

  /**
   * エクスポートする関数(ローカルストレージから取得→CSVに変換)
   * @returns {void} この関数は値を返さず、ローカルストレージからファイルを読み込む際に呼び出される。
   */
  const handleExport = (): void => {
    console.log('📤 エクスポート前のデータ:', contacts);

    // まずは全てのデータを CSVContact に変換
    const csvContacts: CSVContact[] = contacts.map((contact) =>
      contactToCSV(contact, groups)
    );

    console.log('📋 変換後の CSVContacts:', csvContacts);

    // `CSVContact[]` を `ValidatableContact[]` に変換
    const validatableContacts: ValidatableContact[] = csvContacts.map(
      (csvContact) => ({
        name: csvContact.fullName, // `fullName` を `name` に変換
        phone: csvContact.phone,
      })
    );

    // バリデーションチェック
    const newErrors: string[] = [];
    const validContacts: CSVContact[] = csvContacts.filter(
      (csvContact, index) => {
        // fullName を name に変換してバリデーションを行う
        const tempContact: ValidatableContact = {
          name: csvContact.fullName, // fullName を name として扱う
          phone: csvContact.phone,
        };

        // バリデーション実行
        if (!validateContactData(tempContact, validatableContacts)) {
          console.error(
            `❌ バリデーションエラー (Row ${index + 1}):`,
            csvContact
          );
          newErrors.push(
            `Row ${index + 1}: 不正なデータを含むためエクスポートされません (${
              csvContact.fullName
            })`
          );
          return false;
        }
        return true;
      }
    );

    // エラーがある場合は処理を中断
    if (newErrors.length > 0) {
      setErrors(newErrors);
      alert('エクスポート可能なデータがありません');
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
