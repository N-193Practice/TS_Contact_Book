import { JSX, useState, useRef } from 'react';
import { useSubmit } from 'react-router';
import { useContacts } from '../../contexts/useContacts';
import styles from './CSVImport.module.css';
import { Button, TextField, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { MESSAGES } from '../../utils/message';
import { AppError } from '../../utils/errors';

/**
 * `CSVImport` コンポーネント
 * CSVファイルを読み込み、連絡先を追加する。
 * @returns {JSX.Element | null} UIコンポーネントを返す。
 */
function CSVImport(): JSX.Element | null {
  const submit = useSubmit();

  const { setErrorMessage, setSuccessMessage } = useContacts();
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [inputKey, setInputKey] = useState<number>(Date.now());

  /**
   * CSVファイルを選択する関数。
   * @param {React.ChangeEvent<HTMLInputElement>} e - ファイルの選択イベント。
   * @returns {void} この関数は値を返さず、ファイルを選択したときに呼び出される関数。
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      setErrorMessage(MESSAGES.CSV.NO_SELECTED_FILE);
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
    setInputKey(Date.now());
  };

  /**
   * CSVファイルをインポートする関数。
   * @returns {void} この関数は値を返さず、インポートし、メッセージを表示する。
   */
  const handleImport = async (): Promise<void> => {
    if (!file) {
      setErrorMessage(MESSAGES.CSV.NO_SELECTED_FILE);
      return;
    }

    // CSVファイルの内容を取得し、連絡先を追加する。
    try {
      const readFile = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsText(file);
          reader.onload = () => {
            resolve(reader.result as string);
          };
          reader.onerror = () => reject(new AppError('Error reading file'));
        });
      };
      const fileContent = await readFile(file);

      const formData = new FormData();
      formData.append('fileContent', fileContent);
      await submit(formData, { method: 'post', action: '/contacts/csv' });
      setSuccessMessage(MESSAGES.CSV.IMPORT_SUCCESS);
      setErrorMessage(null);
      setFile(null);
      setInputKey(Date.now());
    } catch {
      setErrorMessage(MESSAGES.CSV.IMPORT_ERROR);
    }
    setFile(null);
  };

  return (
    <div className={styles.container}>
      {/* ファイル選択 */}
      <Button
        variant="contained"
        component="label"
        startIcon={<CloudUploadIcon />}
      >
        ファイルを選択
        <input
          key={inputKey}
          type="file"
          accept=".csv"
          hidden
          onChange={handleFileChange}
        />
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
