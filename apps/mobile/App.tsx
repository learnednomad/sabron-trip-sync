import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './src/providers/auth-provider';
import { I18nProvider } from './src/providers/i18n-provider';
import Navigation from './src/navigation';
import './global.css';
import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { processOfflineQueue } from './src/utils/offline-queue';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
      enabled: true, // Enable queries by default
      networkMode: 'offlineFirst',
    },
  },
});

export default function App() {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        processOfflineQueue();
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <I18nProvider>
          <AuthProvider>
            <Navigation />
            <StatusBar style="auto" />
          </AuthProvider>
        </I18nProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
