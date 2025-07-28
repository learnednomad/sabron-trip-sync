import { Link } from 'expo-router';
import React from 'react';
import { Alert, SafeAreaView } from 'react-native';

import type { LoginFormProps } from '@/features/auth';
import { LoginForm } from '@/features/auth';
import { FocusAwareStatusBar, Text, View } from '@/components/ui';
import { useAuth } from '@/lib';

export default function Login() {
  const signIn = useAuth.use.signIn();
  const status = useAuth.use.status();

  const onSubmit: LoginFormProps['onSubmit'] = async (data) => {
    try {
      await signIn(data.email, data.password);
      // Navigation will be handled by auth state change in _layout.tsx
    } catch (error: any) {
      Alert.alert(
        'Login Failed',
        error.message || 'Invalid email or password. Please try again.'
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <FocusAwareStatusBar />
      <View className="flex-1">
        <LoginForm onSubmit={onSubmit} isLoading={status === 'loading'} />

        {/* Sign Up Link */}
        <View className="absolute inset-x-0 bottom-0 bg-white pb-8 dark:bg-gray-900">
          <Text className="text-center text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{' '}
            <Link href="/register" asChild>
              <Text className="font-semibold text-blue-600 dark:text-blue-400">
                Sign Up
              </Text>
            </Link>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
