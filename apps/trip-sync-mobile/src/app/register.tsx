import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Alert, SafeAreaView } from 'react-native';

import type { RegisterFormProps } from '@/components/register-form';
import { RegisterForm } from '@/components/register-form';
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
        <View className="absolute bottom-0 left-0 right-0 pb-8 bg-white dark:bg-gray-900">
          <Text className="text-center text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/login" asChild>
              <Text className="text-blue-600 dark:text-blue-400 font-semibold">
                Sign In
              </Text>
            </Link>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}