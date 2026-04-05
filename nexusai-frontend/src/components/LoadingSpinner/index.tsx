'use client';
import { Box, CircularProgress } from '@mui/material';
import { styles } from './styles';

interface LoadingSpinnerProps {
  size?: number;
}

const LoadingSpinner = ({ size = 40 }: LoadingSpinnerProps) => (
  <Box sx={styles?.wrapper()}>
    <CircularProgress size={size} />
  </Box>
);

export default LoadingSpinner;
