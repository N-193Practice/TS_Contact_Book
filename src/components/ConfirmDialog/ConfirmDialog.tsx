import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';

type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
};

/**
 * `ConfirmDialog` コンポーネント（削除確認ダイアログ）
 */
function ConfirmDialog({
  open,
  title = '確認',
  message,
  onClose,
  onConfirm,
}: ConfirmDialogProps) {
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
