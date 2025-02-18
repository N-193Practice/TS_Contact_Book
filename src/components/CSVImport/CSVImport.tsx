import { JSX, useState } from 'react';
import { usePapaParse } from 'react-papaparse';
import { useContacts } from '../../contexts/useContacts';
import { useGroups } from '../../contexts/useGroups';
import { CSVContact } from '../../models/types';
import { csvToContact } from '../../utils/csvConverter';
import { validateContactsFromCSV } from '../../utils/validation';
import { Button } from '@mui/material';

/**
 * `CSVImport` コンポーネント
 * CSVファイルを読み込み、連絡先を追加する。
 * @returns {JSX.Element | null} UIコンポーネントを返す。
 */
function CSVImport(): JSX.Element | null {
  const { contacts, addContact, updateContact } = useContacts();
  const { groups, addGroup } = useGroups();
  const { readString } = usePapaParse(); // CSVをJSONに変換
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<string[]>([]); // バリデーションエラー

  /**
   * CSVファイルを選択する関数。
   * @param {React.ChangeEvent<HTMLInputElement>} e - ファイルの選択イベント。
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      alert('ファイルを選択してください');
      return;
    }
    setFile(selectedFile);
    setErrors([]); // エラーリセット
  };

  /**
   * CSVファイルをインポートする関数。
   */
  const handleImport = (): void => {
    if (!file) {
      alert('ファイルを選択してください');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target?.result) {
        alert('ファイルの読み込みに失敗しました');
        return;
      }

      // CSVデータをJSONへ変換
      readString(e.target.result as string, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const csvContacts = results.data as CSVContact[];

          // 一括バリデーション
          const isValid = validateContactsFromCSV(
            csvContacts,
            contacts,
            groups
          );
          if (!isValid) {
            alert('CSVにエラーがあるため、インポートを中断しました');
            return;
          }

          // CSVデータを `Contact` 型に変換
          const validContacts = csvContacts.map((csvRow) =>
            csvToContact(csvRow, contacts, groups, addGroup)
          );

          // データを追加・更新
          validContacts.forEach((contact) => {
            const isUpdate = contacts.some((c) => c.id === contact.id);
            if (isUpdate) {
              updateContact(contact);
            } else {
              addContact(contact);
            }
          });

          alert('CSVのインポートが完了しました');
          setFile(null);
        },
      });
    };

    reader.readAsText(file);
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <Button
        variant="contained"
        color="primary"
        onClick={handleImport}
        disabled={!file}
      >
        CSVImport
      </Button>

      {errors.length > 0 && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          <h4>バリデーションエラー:</h4>
          <ul>
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CSVImport;
