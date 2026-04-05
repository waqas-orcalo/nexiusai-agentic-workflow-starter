'use client';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Typography, Divider, Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ReactNode } from 'react';
import { styles } from './styles';

interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
}

const CustomModal = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
}: CustomModalProps) => (
  <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth={fullWidth} PaperProps={{ sx: styles?.paper() }}>
    <DialogTitle sx={styles?.titleBar()}>
      <Typography variant="h6" fontWeight={600}>{title}</Typography>
      <IconButton onClick={onClose} size="small"><CloseIcon fontSize="small" /></IconButton>
    </DialogTitle>
    <Divider />
    <DialogContent sx={styles?.content()}>{children}</DialogContent>
    {actions && (
      <>
        <Divider />
        <DialogActions sx={styles?.actions()}>{actions}</DialogActions>
      </>
    )}
  </Dialog>
);

export default CustomModal;
