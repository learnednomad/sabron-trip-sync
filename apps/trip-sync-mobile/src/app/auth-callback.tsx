import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Alert } from 'react-native';

import { SafeAreaView, Text, View } from '@/components/ui';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the access_token and refresh_token from the URL params
        const accessToken = params.access_token as string;
        const refreshToken = params.refresh_token as string;

        if (accessToken && refreshToken) {
          // Set the session using the tokens
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            throw error;
          }

          Alert.alert(
            'Email Verified!',
            'Your email has been successfully verified. You can now log in.',
            [
              {
                text: 'OK',
                onPress: () => router.replace('/login'),
              },
            ]
          );
        } else {
          // Handle error case
          Alert.alert(
            'Verification Failed',
            'Unable to verify your email. Please try again.',
            [
              {
                text: 'OK',
                onPress: () => router.replace('/login'),
              },
            ]
          );
        }
      } catch (error: any) {
        Alert.alert(
          'Error',
          error.message || 'An error occurred during verification.',
          [
            {
              text: 'OK',
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