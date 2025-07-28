import { Redirect, Stack } from 'expo-router';
import React from 'react';

import { useAuth } from '@/lib';

export default function AuthLayout() {
  const status = useAuth.use.status();

  // If user is already authenticated, redirect to authenticated routes
  if (status === 'signIn') {
    return <Redirect href="/home" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="auth-callback" />
    </Stack>
  );
}