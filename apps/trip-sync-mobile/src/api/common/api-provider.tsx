import { useReactQueryDevTools } from '@dev-plugins/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as React from 'react';

export const queryClient = new QueryClient();

interface APIProviderProps {
  children: React.ReactNode;
}

export function APIProvider({ children }: APIProviderProps) {
  useReactQueryDevTools(queryClient);
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      {children as any}
    </QueryClientProvider>
  );
}
