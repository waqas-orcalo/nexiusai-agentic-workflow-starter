'use client';
import { Box, AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { AutoAwesome, Language, ArrowForward } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { styles } from './styles';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout = ({ children }: PublicLayoutProps) => {
  const router = useRouter();

  return (
    <Box sx={styles.wrapper()}>
      <AppBar position="fixed" sx={styles.appBar()}>
        <Toolbar sx={styles.toolbar()}>
          {/* Logo */}
          <Box sx={styles.logo()} onClick={() => router.push('/home')}>
            <Box sx={styles.logoIcon()}>
              <AutoAwesome sx={{ fontSize: 16, color: '#fff' }} />
            </Box>
            <Typography sx={styles.logoText()}>NexusAI</Typography>
          </Box>

          {/* Nav Links */}
          <Box sx={styles.navLinks()}>
            {['Chat Hub', 'Marketplace', 'Discover New', 'Agents'].map((item) => (
              <Button
                key={item}
                sx={styles.navLink()}
                onClick={() => router.push(`/${item.toLowerCase().replace(/ /g, '-')}`)}>
                {item}
              </Button>
            ))}
          </Box>

          {/* Actions */}
          <Box sx={styles.navActions()}>
            <Button sx={styles.langBtn()} startIcon={<Language />}>
              EN
            </Button>
            <Button sx={styles.signInBtn()} onClick={() => router.push('/sign-in')}>
              Sign in
            </Button>
            <Button
              variant="contained"
              sx={styles.getStartedBtn()}
              endIcon={<ArrowForward />}
              onClick={() => router.push('/home')}>
              Get Started
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={styles.content()}>{children}</Box>
    </Box>
  );
};

export default PublicLayout;
