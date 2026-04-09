import type { Metadata } from 'next';
import '@/styles/globals.css';
import ClientProviders from '@/providers/ClientProviders';

export const metadata: Metadata = {
  title: 'NexusAI — Find your perfect AI model',
  description: 'Guided AI model discovery. 525+ models, 28 AI labs. No tech knowledge needed.',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=Instrument+Sans:ital,wght@0,400;0,500;1,400&display=swap"
        rel="stylesheet"
      />
    </head>
    <body>
      <ClientProviders>
        {children}
      </ClientProviders>
    </body>
  </html>
);

export default RootLayout;
