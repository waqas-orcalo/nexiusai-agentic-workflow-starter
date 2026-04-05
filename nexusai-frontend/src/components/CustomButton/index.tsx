'use client';
import { Button, ButtonProps, CircularProgress } from '@mui/material';
import { styles } from './styles';

interface CustomButtonProps extends ButtonProps {
  loading?: boolean;
  label: string;
}

const CustomButton = ({ loading = false, label, disabled, ...rest }: CustomButtonProps) => (
  <Button
    {...rest}
    disabled={disabled || loading}
    sx={{ ...styles?.button(), ...rest.sx }}
    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : rest.startIcon}
  >
    {label}
  </Button>
);

export default CustomButton;
