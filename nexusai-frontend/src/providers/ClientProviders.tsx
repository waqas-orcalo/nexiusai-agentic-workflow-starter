'use client';
import { ReactNode } from 'react';
import { SnackbarProvider } from 'notistack';
import ReduxProvider from './ReduxProvider';
import ThemeRegistry from '@/theme';

interface ClientProvidersProps {
  children: ReactNode;
}

const ClientProviders = ({ children }: ClientProvidersProps) => (
  <ReduxProvider>
    <ThemeRegistry>
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        {children}
      </SnackbarProvider>
    </ThemeRegistry>
  </ReduxProvider>
);

export default ClientProviders;
