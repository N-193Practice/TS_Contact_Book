import { JSX, useState } from 'react';
import { usePapaParse } from 'react-papaparse';
import useContacts from '../../contexts/useContacts';
import { Button } from '@mui/material';
import { Contact } from '../../models/Contact';
import { AppError } from '../../utils/errors';

// TODO:CSVImportの実装(バリデーション)
function CSVImport(): JSX.Element | null {
  const { addContact } = useContacts();
  const { readString } = usePapaParse(); // CSVをJSONに変換するライブラリ
  const [file, setFile] = useState<File | null>(null); // ファイルのセット

  // ファイルを選択する関数
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      alert('ファイルを選択してください');
      return;
    }
    setFile(file);
  };

  // CSVインポートする関数
  const handleImport = () => {
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
      try {
        readString(e.target.result as string, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            // ファイルのデータをコンテキストに追加
            const data = results.data as Contact[];
            data.forEach((contact) => {
              if (!addContact(contact)) {
                alert('連絡先の追加に失敗しました');
                return;
              }
            });
            alert('ファイルの読み込みが完了しました');
            setFile(null);
          },
        });
      } catch (error) {
        throw new AppError(
          `Error parsing contacts from CSV: ${(error as Error).message}`,
          500
        );
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <Button onClick={handleImport}>CSVImport</Button>
      <input type="file" onChange={handleFileChange} />
    </>
  );
}
export default CSVImport;
