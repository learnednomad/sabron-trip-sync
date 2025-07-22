import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, ScrollView } from 'react-native';

import {
  Button,
  FocusAwareStatusBar,
  SafeAreaView,
  Text,
  View,
} from '@/components/ui';
import { useIsFirstTime } from '@/lib/hooks';

const { width } = Dimensions.get('window');

export default function Onboarding() {
  const [_, setIsFirstTime] = useIsFirstTime();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <FocusAwareStatusBar />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6">
          {/* Header with Logo */}
          <View className="items-center pb-10 pt-20">
            <View className="mb-8 size-32 items-center justify-center rounded-full bg-blue-600 shadow-2xl">
              <Text className="text-6xl font-bold text-white">T</Text>
            </View>
            <Text className="text-center text-4xl font-bold text-gray-900 dark:text-white">
              Welcome to TripSync
            </Text>
            <Text className="mt-3 px-4 text-center text-lg text-gray-600 dark:text-gray-400">
              Your ultimate travel companion
            </Text>
          </View>

          {/* Features Section */}
          <View className="flex-1 justify-center px-4 pb-8">
            <View className="space-y-6">
              <View className="flex-row items-start">
                <View className="mr-4 size-12 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/30">
                  <Text className="text-2xl">✈️</Text>
                </View>
                <View className="flex-1">
                  <Text className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                    Plan Your Journey
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-400">
                    Create detailed itineraries and organize your trips
                    effortlessly
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start">
                <View className="mr-4 size-12 items-center justify-center rounded-2xl bg-green-100 dark:bg-green-900/30">
                  <Text className="text-2xl">📍</Text>
                </View>
                <View className="flex-1">
                  <Text className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                    Track Your Adventures
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-400">
                    Keep a record of all the amazing places you've visited
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start">
                <View className="mr-4 size-12 items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-900/30">
                  <Text className="text-2xl">🌍</Text>
                </View>
                <View className="flex-1">
                  <Text className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                    Share Memories
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-400">
                    Connect with fellow travelers and share your experiences
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Action Button */}
          <View className="pb-8">
            <Button
              label="Get Started"
              onPress={() => {
                setIsFirstTime(false);
                router.replace('/login');
              }}
              className="h-14 rounded-2xl bg-blue-600 shadow-lg"
            />

            <Text className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
              By continuing, you agree to our Terms & Privacy Policy
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
