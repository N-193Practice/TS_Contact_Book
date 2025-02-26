import { JSX } from 'react';
import { Alert, Collapse, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

/**
 * アラートのプロパティ
 * @property {string} message - アラートのメッセージ。
 * @property {'error' | 'warning' | 'info' | 'success'} severity - アラートのセマンティクス。
 * @property {() => void} onClose - アラートを閉じるための関数。
 */
type NotificationBannerProps = {
  message: string;
  severity: 'error' | 'warning' | 'info' | 'success';
  onClose: () => void;
};

/**
 * `NotificationBanner` コンポーネント。
 * @returns {JSX.Element} アラート表示用の UI を返す。
 * @param {NotificationBannerProps} props - `NotificationBanner` のプロパティ。
 * @returns {JSX.Element} `NotificationBanner` の UI を返す。
 */
function NotificationBanner({
  message,
  severity,
  onClose,
}: NotificationBannerProps): JSX.Element {
  return (
    <Collapse in={!!message}>
      <Alert
        severity={severity}
        action={
          <IconButton size="small" onClick={onClose}>
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        {message}
      </Alert>
    </Collapse>
  );
}

export default NotificationBanner;
