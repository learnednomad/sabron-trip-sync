import { Redirect, SplashScreen, Stack } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { useAuth, useIsFirstTime } from '@/lib';

export default function AuthenticatedLayout() {
  const status = useAuth.use.status();
  const [isFirstTime] = useIsFirstTime();
  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (status !== 'idle') {
      setTimeout(() => {
        hideSplash();
      }, 1000);
    }
  }, [hideSplash, status]);

  // Auth protection - redirect unauthenticated users
  if (status === 'signOut') {
    return <Redirect href="/login" />;
  }

  // First time users should go through onboarding
  if (isFirstTime) {
    return <Redirect href="/onboarding" />;
  }
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
