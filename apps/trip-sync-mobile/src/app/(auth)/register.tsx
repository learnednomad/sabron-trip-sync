import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Alert, SafeAreaView } from 'react-native';

import type { RegisterFormProps } from '@/features/auth';
import { RegisterForm } from '@/features/auth';
import { FocusAwareStatusBar, Text, View } from '@/components/ui';
import { useAuth } from '@/lib';

export default function Register() {
  const router = useRouter();
  const signUp = useAuth.use.signUp();
  const status = useAuth.use.status();

  const onSubmit: RegisterFormProps['onSubmit'] = async (data) => {
    try {
      // Sign up with email and password
      // Note: fullName will be added to user metadata in a future update
      await signUp(data.email, data.password);
      Alert.alert(
        'Registration Successful!',
        'Please check your email to verify your account.',
        [
          {
            text: 'OK',
            onPress: () => router.push('/login'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        'Registration Failed',
        error.message || 'Unable to create account. Please try again.'
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <FocusAwareStatusBar />
      <View className="flex-1">
        <RegisterForm onSubmit={onSubmit} isLoading={status === 'loading'} />

        {/* Sign In Link */}
        <View className="absolute inset-x-0 bottom-0 bg-white pb-8 dark:bg-gray-900">
          <Text className="text-center text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/login" asChild>
              <Text className="font-semibold text-blue-600 dark:text-blue-400">
                Sign In
              </Text>
            </Link>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
