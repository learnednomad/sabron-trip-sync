import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { ScrollView, Dimensions, Platform } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import * as z from 'zod';

import { Button, ControlledInput, Text, View, Image } from '@/components/ui';

const { height } = Dimensions.get('window');

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

export const LoginForm = ({ onSubmit = () => {}, isLoading = false }: LoginFormProps) => {
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
          {/* Header Section with Logo */}
          <View className="items-center pt-16 pb-8">
            <View className="w-24 h-24 bg-blue-600 rounded-3xl items-center justify-center mb-6 shadow-lg">
              <Text className="text-white text-4xl font-bold">T</Text>
            </View>
            <Text className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome Back
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 mt-2 text-center px-8">
              Sign in to continue your journey with TripSync
            </Text>
          </View>

          {/* Form Section */}
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
              
              {/* Forgot Password Link */}
              <View className="items-end mb-6">
                <Text className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                  Forgot Password?
                </Text>
              </View>
            </View>

            {/* Sign In Button */}
            <Button
              testID="login-button"
              label={isLoading ? "Signing in..." : "Sign In"}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="bg-blue-600 dark:bg-blue-500 h-14 rounded-2xl shadow-sm"
            />

            {/* Divider */}
            <View className="flex-row items-center my-8">
              <View className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              <Text className="px-4 text-gray-500 dark:text-gray-400 text-sm">
                OR
              </Text>
              <View className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            </View>

            {/* Social Login Buttons */}
            <View className="space-y-3">
              <Button
                label="Continue with Google"
                variant="outline"
                className="h-14 rounded-2xl border-gray-300 dark:border-gray-600"
                disabled={isLoading}
              />
              <Button
                label="Continue with Apple"
                variant="outline"
                className="h-14 rounded-2xl border-gray-300 dark:border-gray-600"
                disabled={isLoading}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
