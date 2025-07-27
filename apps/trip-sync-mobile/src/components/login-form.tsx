import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { Platform, ScrollView } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import * as z from 'zod';

import { Button, ControlledInput, Text, View } from '@/components/ui';
import { signInWithProvider } from '@/lib/auth';

const schema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email format'),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(6, 'Password must be at least 6 characters'),
});

export type FormType = z.infer<typeof schema>;

export type LoginFormProps = {
  onSubmit?: SubmitHandler<FormType>;
  isLoading?: boolean;
};

const LoginHeader = () => (
  <View className="items-center pb-8 pt-16">
    <View className="mb-6 size-24 items-center justify-center rounded-3xl bg-blue-600 shadow-lg">
      <Text className="text-4xl font-bold text-white">T</Text>
    </View>
    <Text className="text-3xl font-bold text-gray-900 dark:text-white">
      Welcome Back
    </Text>
    <Text className="mt-2 px-8 text-center text-gray-500 dark:text-gray-400">
      Sign in to continue your journey with TripSync
    </Text>
  </View>
);

const SocialLoginButtons = ({ isLoading }: { isLoading: boolean }) => {
  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    try {
      await signInWithProvider(provider);
    } catch (error) {
      console.error(`${provider} login failed:`, error);
      // Error handling is already done in the auth store
    }
  };

  return (
    <>
      <View className="my-8 flex-row items-center">
        <View className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
        <Text className="px-4 text-sm text-gray-500 dark:text-gray-400">OR</Text>
        <View className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
      </View>
      <View className="space-y-3">
        <Button
          label="Continue with Google"
          variant="outline"
          className="h-14 rounded-2xl border-gray-300 dark:border-gray-600"
          disabled={isLoading}
          onPress={() => handleSocialLogin('google')}
        />
        <Button
          label="Continue with Apple"
          variant="outline"
          className="h-14 rounded-2xl border-gray-300 dark:border-gray-600"
          disabled={isLoading}
          onPress={() => handleSocialLogin('apple')}
        />
      </View>
    </>
  );
};

export const LoginForm = ({
  onSubmit = () => {},
  isLoading = false,
}: LoginFormProps) => {
  const { handleSubmit, control } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View className="flex-1 bg-white dark:bg-gray-900">
          <LoginHeader />
          <View className="flex-1 px-6 pt-8">
            <View className="space-y-4">
              <ControlledInput
                testID="email-input"
                control={control}
                name="email"
                label="Email Address"
                placeholder="you@example.com"
                autoCapitalize="none"
                keyboardType="email-address"
                className="mb-4"
              />
              <ControlledInput
                testID="password-input"
                control={control}
                name="password"
                label="Password"
                placeholder="Enter your password"
                secureTextEntry={true}
                className="mb-2"
              />
              <View className="mb-6 items-end">
                <Text className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Forgot Password?
                </Text>
              </View>
            </View>
            <Button
              testID="login-button"
              label={isLoading ? 'Signing in...' : 'Sign In'}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="h-14 rounded-2xl bg-blue-600 shadow-sm dark:bg-blue-500"
            />
            <SocialLoginButtons isLoading={isLoading} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
