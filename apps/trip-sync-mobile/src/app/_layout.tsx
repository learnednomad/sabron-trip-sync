// Import  global CSS file
import '../../global.css';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { APIProvider } from '@/api';
import { loadSelectedTheme, useAuth } from '@/lib';
import { useThemeConfig } from '@/lib/use-theme-config';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(app)',
};

loadSelectedTheme();
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 500,
  fade: true,
});

export default function RootLayout() {
  const status = useAuth.use.status();
  const hydrate = useAuth.use.hydrate();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (status !== 'idle' && status !== 'loading') {
      SplashScreen.hideAsync();
    }
  }, [status]);

  // Show nothing while checking auth status
  if (status === 'idle' || status === 'loading') {
    return null;
  }

  return (
    <Providers>
      <Stack>
        {status === 'signIn' ? (
          <>
            <Stack.Screen name="(app)" options={{ headerShown: false }} />
            <Stack.Screen
              name="onboarding"
              options={{ headerShown: false, presentation: 'modal' }}
            />
            <Stack.Screen
              name="login"
              options={{ headerShown: false, presentation: 'modal' }}
            />
            <Stack.Screen
              name="register"
              options={{ headerShown: false, presentation: 'modal' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="(app)" options={{ headerShown: false }} />
          </>
        )}
      </Stack>
    </Providers>
  );
}

function Providers({ children }: { children: React.ReactNode }) {
  const theme = useThemeConfig();
  return (
    <GestureHandlerRootView
      style={styles.container}
      className={theme.dark ? `dark` : undefined}
    >
      <KeyboardProvider>
        <ThemeProvider value={theme}>
          <APIProvider>
            <BottomSheetModalProvider>
              {children}
              <FlashMessage position="top" />
            </BottomSheetModalProvider>
          </APIProvider>
        </ThemeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
