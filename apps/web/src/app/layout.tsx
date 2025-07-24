import { Inter } from 'next/font/google';

import { Providers } from '@/providers';
import { AuthProvider } from '@/providers/auth-provider';
import { I18nProvider } from '@/providers/i18n-provider';

import type { Metadata } from 'next';
import '@radix-ui/themes/styles.css';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sabron Trip Sync',
  description: 'Plan and sync your travel itineraries',
};

const RootLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={inter.className}>
        <Providers>
          <I18nProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </I18nProvider>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
