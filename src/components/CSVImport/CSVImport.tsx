import { JSX, useState, useEffect, useRef } from 'react';
import { usePapaParse } from 'react-papaparse';
import { useContacts } from '../../contexts/useContacts';
import { useGroups } from '../../contexts/useGroups';
import { CSVContact } from '../../models/types';
import { csvToContact } from '../../utils/csvConverter';
import { validateContactsFromCSV } from '../../utils/validation';
import styles from './CSVImport.module.css';
import { Button, TextField, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

/**
 * `CSVImport` コンポーネント
 * CSVファイルを読み込み、連絡先を追加する。
 * @returns {JSX.Element | null} UIコンポーネントを返す。
 */
function CSVImport(): JSX.Element | null {
  const { contacts, bulkImportContacts, setErrorMessage, setSuccessMessage } =
    useContacts();
  const { groups, addGroup } = useGroups();
  const { readString } = usePapaParse(); // CSVをJSONに変換
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 最後に読み込みした CSVの contactsの監視をする。
  useEffect(() => {}, [contacts]);

  /**
   * CSVファイルを選択する関数。
   * @param {React.ChangeEvent<HTMLInputElement>} e - ファイルの選択イベント。
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      setErrorMessage('ファイルを選択してください');
      return;
    }
    setFile(selectedFile);
  };

  /**
   * ファイルを削除し、`input`の値もリセットする関数。
   * @returns {void} この関数は値を返さず、ファイル選択をリセットする。
   */
  const handleRemoveFile = (): void => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * CSVファイルをインポートする関数。
   * @returns {void} この関数は値を返さず、インポートし、メッセージを表示する。
   */
  const handleImport = (): void => {
    if (!file) {
      setErrorMessage('ファイルを選択してください');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target?.result) {
        setErrorMessage('ファイルの読み込みに失敗しました');
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
            setErrorMessage
          );
          if (!isValid) {
            setErrorMessage('CSVにエラーがあるため、インポートを中断しました');
            return;
          }

          // CSVデータを `Contact` 型に変換
          const validContacts = csvContacts
            .map((csvRow) => csvToContact(csvRow, contacts, groups, addGroup))
            .filter(Boolean); // 無効データは除外

          // 一括登録処理を実行（forEach ではなく、まとめて setContacts する）
          bulkImportContacts(validContacts);

          setSuccessMessage('CSVのインポートが完了しました');
          setErrorMessage(null);
          setFile(null);
        },
      });
    };

    reader.readAsText(file);
  };

  return (
    <div>
      {/* ファイル選択 */}
      <Button
        variant="contained"
        component="label"
        startIcon={<CloudUploadIcon />}
      >
        ファイルを選択
        <input type="file" accept=".csv" hidden onChange={handleFileChange} />
      </Button>
      {/* 選択したファイル名を表示 */}
      <TextField
        variant="outlined"
        size="small"
        value={file ? file.name : ''}
        placeholder="ファイルなし"
        InputProps={{
          readOnly: true,
          endAdornment: file && (
            <IconButton onClick={handleRemoveFile}>
              <DeleteIcon color="error" />
            </IconButton>
          ),
        }}
        inputRef={fileInputRef}
        className={styles.fileInput}
      />

      {/* 取り込みボタン */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleImport}
        disabled={!file}
      >
        データを取り込む
      </Button>
    </div>
  );
}

export default CSVImport;
