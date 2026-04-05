'use client';
import { Box, Typography } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import { styles } from './styles';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

const EmptyState = ({ title = 'No Data Found', description = 'There are no records to display.' }: EmptyStateProps) => (
  <Box sx={styles?.wrapper()}>
    <InboxIcon sx={styles?.icon()} />
    <Typography sx={styles?.title()}>{title}</Typography>
    <Typography variant="body2">{description}</Typography>
  </Box>
);

export default EmptyState;
