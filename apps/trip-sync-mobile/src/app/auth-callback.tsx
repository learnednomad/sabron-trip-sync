import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import type { EmailOtpType } from '@supabase/supabase-js';

import { SafeAreaView, Text, View } from '@/components/ui';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const tokenHash = params.token_hash as string;
        const type = params.type as EmailOtpType;
        const accessToken = params.access_token as string;
        const refreshToken = params.refresh_token as string;

        // Handle EmailOtpType verification (preferred method)
        if (tokenHash && type) {
          const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash: tokenHash,
          });

          if (error) {
            throw error;
          }

          const message = type === 'signup' 
            ? 'Email verified successfully! You can now access your account.'
            : type === 'recovery'
            ? 'Password reset verification successful. You can now set a new password.'
            : 'Email verification successful!';

          const destination = type === 'recovery' ? '/reset-password' : '/(tabs)';

          Alert.alert(
            'Verification Successful!',
            message,
            [
              {
                text: 'Continue',
                onPress: () => router.replace(destination),
              },
            ]
          );
        }
        // Fallback to legacy token method
        else if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            throw error;
          }

          Alert.alert(
            'Email Verified!',
            'Your email has been successfully verified. You can now access your account.',
            [
              {
                text: 'Continue',
                onPress: () => router.replace('/(tabs)'),
              },
            ]
          );
        } else {
          Alert.alert(
            'Verification Failed',
            'Unable to verify your email. Please try again or contact support.',
            [
              {
                text: 'Back to Login',
                onPress: () => router.replace('/login'),
              },
            ]
          );
        }
      } catch (error: any) {
        console.error('Auth callback error:', error);
        Alert.alert(
          'Verification Error',
          error.message || 'An error occurred during verification. Please try again.',
          [
            {
              text: 'Back to Login',
              onPress: () => router.replace('/login'),
            },
          ]
        );
      }
    };

    handleCallback();
  }, [params, router]);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <View className="flex-1 items-center justify-center p-6">
        <ActivityIndicator size="large" className="mb-4" />
        <Text className="text-lg font-medium text-gray-900 dark:text-white">
          Verifying your email...
        </Text>
        <Text className="mt-2 text-center text-gray-600 dark:text-gray-400">
          Please wait while we confirm your email address.
        </Text>
      </View>
    </SafeAreaView>
  );
}