import { Box } from '@mui/material';
import { styles } from './styles';

const FOOTER_LINKS = ['Models', 'Research', 'API', 'Privacy', 'Terms'];

const LandingFooter = () => (
  <Box component="footer" sx={styles?.footer()}>
    <Box sx={styles?.brand()}>NexusAI Model Marketplace</Box>
    <Box sx={styles?.links()}>
      {FOOTER_LINKS.map((link) => (
        <Box component="a" key={link} href="#" sx={styles?.link()}>
          {link}
        </Box>
      ))}
    </Box>
  </Box>
);

export default LandingFooter;
