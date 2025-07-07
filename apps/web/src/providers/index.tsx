'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { useState, type ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

const queryConfig = {
  queries: {
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  },
};

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient({ defaultOptions: queryConfig }));

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-right" />
        </ThemeProvider>
      </ReactQueryStreamedHydration>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
