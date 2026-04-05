'use client';
import { Box, Toolbar } from '@mui/material';
import { ReactNode } from 'react';
import Header from '@/layout/Header';
import Sidebar from '@/layout/Sidebar';
import { styles } from './styles';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => (
  <Box sx={styles?.root()}>
    <Header />
    <Sidebar />
    <Box component="main" sx={styles?.mainContent()}>
      <Toolbar />
      {children}
    </Box>
  </Box>
);

export default MainLayout;
