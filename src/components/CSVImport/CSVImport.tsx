import { JSX, useState } from 'react';
import { usePapaParse } from 'react-papaparse';
import useContacts from '../../contexts/useContacts';
import useGroups from '../../contexts/useGroups';
import { Contact, CSVContact } from '../../models/types';
import { csvToContact } from '../../utils/csvConverter';
import { validateContact } from '../../utils/validation';
import { Button } from '@mui/material';

// TODO:CSVImportの実装(CSVContact → Contact)
/**
 * `CSVImport` コンポーネント。
 * CSVファイルを読み込み、連絡先を追加する。
 * @returns {JSX.Element | null} 読み込みに成功した場合は UI を返す。
 */
function CSVImport(): JSX.Element | null {
  const { addContact, contacts } = useContacts();
  const { groups, addGroup } = useGroups();
  const { readString } = usePapaParse(); // CSVをJSONに変換するライブラリ
  const [file, setFile] = useState<File | null>(null); // ファイルのセット
  const [errors, setErrors] = useState<string[]>([]); // 読み込み時のエラーメッセージ

  /**
   * CSVファイルを選択する関数。
   * @param {React.ChangeEvent<HTMLInputElement>} e - ファイルの選択イベント。
   * @returns {void} この関数は値を返さず、ファイルを選択したときに呼び出される。
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      alert('ファイルを選択してください');
      return;
    }
    setFile(file);
  };

  /**
   * CSVインポートする関数。
   * @returns {void} この関数は値を返さず、ファイルを選択したときに呼び出される。
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
      // CSVをJSONに変換
      readString(e.target.result as string, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const newErrors: string[] = [];
          const validContacts: Contact[] = [];

          (results.data as CSVContact[]).forEach((csvRow, index) => {
            const contact = csvToContact(csvRow, contacts, groups, addGroup);
            if (!validateContact(contact, contacts, false)) {
              newErrors.push(`Row ${index + 1}: 連絡先データが無効です`);
            } else {
              validContacts.push(contact);
            }
          });

          setErrors(newErrors);

          if (newErrors.length === 0) {
            validContacts.forEach((contact) => addContact(contact));
            alert('ファイルの読み込みが完了しました');
            setFile(null);
          }
        },
      });
    };
    reader.readAsText(file);
  };

  return (
    <>
      <Button onClick={handleImport}>CSVImport</Button>
      <input type="file" onChange={handleFileChange} />
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

export default CSVImport;
