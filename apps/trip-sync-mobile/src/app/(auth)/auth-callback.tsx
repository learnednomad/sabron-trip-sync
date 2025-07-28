import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import type { EmailOtpType, User } from '@supabase/supabase-js';

import { SafeAreaView, Text, View } from '@/components/ui';
import { supabase } from '@/lib/supabase';

async function syncOAuthProfile(user: User) {
  try {
    const provider = user.app_metadata.provider;
    const providerData = user.user_metadata;
    
    // Prepare profile data from OAuth provider
    const profileUpdates: any = {};
    
    // Extract profile data based on provider
    if (provider === 'google') {
      if (providerData.full_name && !user.user_metadata.name) {
        profileUpdates.name = providerData.full_name;
      }
      if (providerData.picture && !user.user_metadata.profile_picture_url) {
        profileUpdates.profile_picture_url = providerData.picture;
      }
    } else if (provider === 'apple') {
      if (providerData.full_name && !user.user_metadata.name) {
        profileUpdates.name = providerData.full_name;
      }
    }
    
    // Update user metadata if we have new data
    if (Object.keys(profileUpdates).length > 0) {
      const { error: updateError } = await supabase.auth.updateUser({
        data: profileUpdates
      });
      
      if (updateError) {
        console.error('Failed to sync OAuth profile:', updateError);
      } else {
        console.log('OAuth profile synced successfully:', profileUpdates);
      }
    }
    
    // Update user profile in database if it exists
    const { error: dbUpdateError } = await supabase
      .from('users')
      .update({
        name: profileUpdates.name || user.user_metadata.name,
        profile_picture_url: profileUpdates.profile_picture_url || user.user_metadata.profile_picture_url,
        last_sign_in_provider: provider,
        updated_at: new Date().toISOString()
      })
      .eq('auth_user_id', user.id);
      
    if (dbUpdateError) {
      console.error('Failed to update user profile in database:', dbUpdateError);
    }
  } catch (error) {
    console.error('Error syncing OAuth profile:', error);
  }
}

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
        const code = params.code as string;
        const state = params.state as string;

        // Handle OAuth PKCE flow
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            // Handle account linking scenarios
            if (error.message?.includes('User already registered')) {
              Alert.alert(
                'Account Already Exists',
                'An account with this email already exists. Please sign in with your password first, then link your social accounts from your profile settings.',
                [
                  {
                    text: 'Back to Login',
                    onPress: () => router.replace('/login'),
                  },
                ]
              );
              return;
            }
            throw error;
          }

          // Sync profile data from OAuth provider if available
          if (data.user && data.user.app_metadata.provider !== 'email') {
            await syncOAuthProfile(data.user);
          }

          // Handle account linking success
          const isAccountLinking = state?.startsWith('link_account:');
          const message = isAccountLinking 
            ? `Your ${data.user?.app_metadata.provider} account has been successfully linked!`
            : `Welcome! You've successfully signed in with ${data.user?.app_metadata.provider}.`;

          Alert.alert(
            'Authentication Successful!',
            message,
            [
              {
                text: 'Continue',
                onPress: () => router.replace('/(tabs)'),
              },
            ]
          );
          return;
        }

        // Handle EmailOtpType verification (email verification and password reset)
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
          // Set the session using the tokens
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            throw error;
          }

          // Check if this is from an OAuth provider and sync profile
          if (data.user && data.user.app_metadata.provider !== 'email') {
            await syncOAuthProfile(data.user);
          }

          Alert.alert(
            'Authentication Successful!',
            'You have been successfully authenticated and can now access your account.',
            [
              {
                text: 'Continue',
                onPress: () => router.replace('/(tabs)'),
              },
            ]
          );
        } else {
          Alert.alert(
            'Authentication Failed',
            'Unable to complete authentication. Please try again or contact support.',
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
          'Authentication Error',
          error.message || 'An error occurred during authentication. Please try again.',
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