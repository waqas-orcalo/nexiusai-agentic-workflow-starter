import { Box } from '@mui/material';
import { styles } from './styles';

const STATS = [
  { value: '525+', label: 'AI Models' },
  { value: '82K', label: 'Builders' },
  { value: '28', label: 'AI Labs' },
  { value: '4.8⭐', label: 'Avg Rating' },
];

const HeroStats = () => (
  <Box sx={styles?.wrapper()}>
    {STATS.map((stat) => (
      <Box key={stat.label} sx={styles?.stat()}>
        <Box component="span" sx={styles?.statValue()}>{stat.value}</Box>
        <Box component="span" sx={styles?.statLabel()}>{stat.label}</Box>
      </Box>
    ))}
  </Box>
);

export default HeroStats;
