import { JSX } from 'react';
import { Alert, Collapse, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type ErrorBannerProps = {
  message: string;
  severity: 'error' | 'warning' | 'info' | 'success';
  onClose: () => void;
};

function ErrorBanner({
  message,
  severity,
  onClose,
}: ErrorBannerProps): JSX.Element {
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

export default ErrorBanner;
