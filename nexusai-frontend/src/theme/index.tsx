'use client';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { ReactNode } from 'react';

const theme = createTheme({
  palette: {
    primary: {
      main: '#C8622A',
      dark: '#A34D1E',
      light: '#FDF1EB',
      contrastText: '#FFFFFF',
    },
    secondary: { main: '#dc004e' },
    background: {
      default: '#F4F2EE',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1C1A16',
      secondary: '#5A5750',
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: { fontSize: '2rem', fontWeight: 700 },
    h2: { fontSize: '1.5rem', fontWeight: 600 },
    h6: { fontSize: '1rem', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: '8px' },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: '12px',
          border: '1px solid rgba(0,0,0,0.08)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        },
      },
    },
  },
});

interface ThemeRegistryProps {
  children: ReactNode;
}

const ThemeRegistry = ({ children }: ThemeRegistryProps) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
);

export default ThemeRegistry;
