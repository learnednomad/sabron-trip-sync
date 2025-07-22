import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { ScrollView, Dimensions, Platform } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import * as z from 'zod';

import { Button, ControlledInput, Text, View, Checkbox } from '@/components/ui';

const { height } = Dimensions.get('window');

const schema = z.object({
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
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, 'Password must contain letters and numbers'),
  confirmPassword: z
    .string({
      required_error: 'Please confirm your password',
    }),
  agreeToTerms: z
    .boolean()
    .refine((val) => val === true, {
      message: 'You must agree to the terms and conditions',
    }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type RegisterFormType = z.infer<typeof schema>;

export type RegisterFormProps = {
  onSubmit?: SubmitHandler<RegisterFormType>;
  isLoading?: boolean;
};

export const RegisterForm = ({ onSubmit = () => {}, isLoading = false }: RegisterFormProps) => {
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
          <View className="items-center pt-12 pb-6">
            <View className="w-20 h-20 bg-green-600 rounded-3xl items-center justify-center mb-4 shadow-lg">
              <Text className="text-white text-3xl font-bold">T</Text>
            </View>
            <Text className="text-3xl font-bold text-gray-900 dark:text-white">
              Join TripSync
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 mt-2 text-center px-8">
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
              <View className="flex-row items-start mb-6 mt-2">
                <Checkbox
                  checked={agreeToTerms}
                  onPress={() => setValue('agreeToTerms', !agreeToTerms)}
                  className="mt-1"
                />
                <View className="flex-1 ml-3">
                  <Text className="text-sm text-gray-600 dark:text-gray-400">
                    I agree to the{' '}
                    <Text className="text-blue-600 dark:text-blue-400 font-medium">
                      Terms of Service
                    </Text>
                    {' '}and{' '}
                    <Text className="text-blue-600 dark:text-blue-400 font-medium">
                      Privacy Policy
                    </Text>
                  </Text>
                </View>
              </View>
            </View>

            {/* Sign Up Button */}
            <Button
              testID="register-button"
              label={isLoading ? "Creating Account..." : "Create Account"}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading || !agreeToTerms}
              className="bg-green-600 dark:bg-green-500 h-14 rounded-2xl shadow-sm mb-6"
            />

            {/* Divider */}
            <View className="flex-row items-center mb-6">
              <View className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              <Text className="px-4 text-gray-500 dark:text-gray-400 text-sm">
                OR
              </Text>
              <View className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
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