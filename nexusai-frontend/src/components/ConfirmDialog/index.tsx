'use client';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Button, CircularProgress,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { styles } from './styles';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
}

const ConfirmDialog = ({
  open,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  onConfirm,
  onCancel,
  loading = false,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
}: ConfirmDialogProps) => (
  <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth PaperProps={{ sx: styles?.paper() }}>
    <DialogTitle sx={styles?.title()}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
        <WarningAmberIcon sx={styles?.icon()} />
      </div>
      {title}
    </DialogTitle>
    <DialogContent>
      <Typography sx={styles?.message()}>{message}</Typography>
    </DialogContent>
    <DialogActions sx={styles?.actions()}>
      <Button variant="outlined" onClick={onCancel} disabled={loading}>{cancelLabel}</Button>
      <Button
        variant="contained"
        color="error"
        onClick={onConfirm}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}
      >
        {confirmLabel}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;
