import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { Dimensions, Platform, ScrollView } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import * as z from 'zod';

import { Button, Checkbox, ControlledInput, Text, View } from '@/components/ui';

const { height } = Dimensions.get('window');

const schema = z
  .object({
    fullName: z
      .string({
        required_error: 'Full name is required',
      })
      .min(2, 'Name must be at least 2 characters'),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email format'),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(6, 'Password must be at least 6 characters')
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)/,
        'Password must contain letters and numbers'
      ),
    confirmPassword: z.string({
      required_error: 'Please confirm your password',
    }),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type RegisterFormType = z.infer<typeof schema>;

export type RegisterFormProps = {
  onSubmit?: SubmitHandler<RegisterFormType>;
  isLoading?: boolean;
};

export const RegisterForm = ({
  onSubmit = () => {},
  isLoading = false,
}: RegisterFormProps) => {
  const { handleSubmit, control, setValue, watch } = useForm<RegisterFormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      agreeToTerms: false,
    },
  });

  const agreeToTerms = watch('agreeToTerms');

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
          {/* Header Section */}
          <View className="items-center pb-6 pt-12">
            <View className="mb-4 size-20 items-center justify-center rounded-3xl bg-green-600 shadow-lg">
              <Text className="text-3xl font-bold text-white">T</Text>
            </View>
            <Text className="text-3xl font-bold text-gray-900 dark:text-white">
              Join TripSync
            </Text>
            <Text className="mt-2 px-8 text-center text-gray-500 dark:text-gray-400">
              Create an account to start your travel journey
            </Text>
          </View>

          {/* Form Section */}
          <View className="flex-1 px-6 pt-4">
            <View className="space-y-3">
              <ControlledInput
                testID="name-input"
                control={control}
                name="fullName"
                label="Full Name"
                placeholder="John Doe"
                autoCapitalize="words"
                className="mb-3"
              />

              <ControlledInput
                testID="email-input"
                control={control}
                name="email"
                label="Email Address"
                placeholder="you@example.com"
                autoCapitalize="none"
                keyboardType="email-address"
                className="mb-3"
              />

              <ControlledInput
                testID="password-input"
                control={control}
                name="password"
                label="Password"
                placeholder="Create a strong password"
                secureTextEntry={true}
                className="mb-3"
              />

              <ControlledInput
                testID="confirm-password-input"
                control={control}
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Re-enter your password"
                secureTextEntry={true}
                className="mb-3"
              />

              {/* Terms and Conditions */}
              <View className="mb-6 mt-2 flex-row items-start">
                <Checkbox
                  checked={agreeToTerms}
                  onPress={() => setValue('agreeToTerms', !agreeToTerms)}
                  className="mt-1"
                />
                <View className="ml-3 flex-1">
                  <Text className="text-sm text-gray-600 dark:text-gray-400">
                    I agree to the{' '}
                    <Text className="font-medium text-blue-600 dark:text-blue-400">
                      Terms of Service
                    </Text>{' '}
                    and{' '}
                    <Text className="font-medium text-blue-600 dark:text-blue-400">
                      Privacy Policy
                    </Text>
                  </Text>
                </View>
              </View>
            </View>

            {/* Sign Up Button */}
            <Button
              testID="register-button"
              label={isLoading ? 'Creating Account...' : 'Create Account'}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading || !agreeToTerms}
              className="mb-6 h-14 rounded-2xl bg-green-600 shadow-sm dark:bg-green-500"
            />

            {/* Divider */}
            <View className="mb-6 flex-row items-center">
              <View className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
              <Text className="px-4 text-sm text-gray-500 dark:text-gray-400">
                OR
              </Text>
              <View className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
            </View>

            {/* Social Sign Up Buttons */}
            <View className="space-y-3 pb-8">
              <Button
                label="Sign up with Google"
                variant="outline"
                className="h-14 rounded-2xl border-gray-300 dark:border-gray-600"
                disabled={isLoading}
              />
              <Button
                label="Sign up with Apple"
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
