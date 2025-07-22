import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Dimensions } from 'react-native';

import {
  Button,
  FocusAwareStatusBar,
  SafeAreaView,
  Text,
  View,
} from '@/components/ui';
import { Logo } from '@/components/ui/icons';
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
          <View className="items-center pt-20 pb-10">
            <View className="w-32 h-32 bg-blue-600 rounded-full items-center justify-center mb-8 shadow-2xl">
              <Text className="text-white text-6xl font-bold">T</Text>
            </View>
            <Text className="text-4xl font-bold text-gray-900 dark:text-white text-center">
              Welcome to TripSync
            </Text>
            <Text className="mt-3 text-lg text-gray-600 dark:text-gray-400 text-center px-4">
              Your ultimate travel companion
            </Text>
          </View>

          {/* Features Section */}
          <View className="flex-1 justify-center px-4 pb-8">
            <View className="space-y-6">
              <View className="flex-row items-start">
                <View className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl items-center justify-center mr-4">
                  <Text className="text-2xl">✈️</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Plan Your Journey
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-400">
                    Create detailed itineraries and organize your trips effortlessly
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start">
                <View className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl items-center justify-center mr-4">
                  <Text className="text-2xl">📍</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Track Your Adventures
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-400">
                    Keep a record of all the amazing places you've visited
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start">
                <View className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl items-center justify-center mr-4">
                  <Text className="text-2xl">🌍</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
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
              className="bg-blue-600 h-14 rounded-2xl shadow-lg"
            />
            
            <Text className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
              By continuing, you agree to our Terms & Privacy Policy
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
