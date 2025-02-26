import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';

/**
 * 確認ダイアログのプロップ
 * @property {boolean} open - ダイアログが開いているかどうか。
 * @property {string} title - ダイアログのタイトル。
 * @property {string} message - ダイアログのメッセージ。
 * @property {() => void} onClose - ダイアログを閉じるための関数。
 * @property {() => void} onConfirm - 確認ボタンを押したときに呼び出される関数。
 */
type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
};

/**
 * `ConfirmDialog` コンポーネント（削除確認ダイアログ）
 * @param {ConfirmDialogProps} props - `ConfirmDialog` のプロパティ。
 * @returns {JSX.Element} `ConfirmDialog` の UI を返す。
 */
function ConfirmDialog({
  open,
  title = '確認',
  message,
  onClose,
  onConfirm,
}: ConfirmDialogProps): JSX.Element {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          キャンセル
        </Button>
        <Button onClick={onConfirm} color="error" autoFocus>
          削除
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
