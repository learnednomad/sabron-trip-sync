import React from 'react';

import {
  FocusAwareStatusBar,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from '@/components/ui';

export default function Home() {
  return (
    <>
      <FocusAwareStatusBar />
      <SafeAreaView className="flex-1 bg-neutral-50">
        <ScrollView className="flex-1 px-4">
          {/* Header */}
          <View className="py-6">
            <Text className="text-3xl font-bold text-charcoal-900">
              Welcome to TripSync
            </Text>
            <Text className="mt-2 text-charcoal-600">
              Plan, organize, and sync your travels
            </Text>
          </View>

          {/* Quick Actions */}
          <View className="mb-6">
            <Text className="mb-4 text-xl font-semibold text-charcoal-800">
              Quick Actions
            </Text>
            <View className="gap-3">
              <Pressable className="rounded-xl bg-primary-500 p-4">
                <Text className="text-center font-semibold text-white">
                  Plan New Trip
                </Text>
              </Pressable>
              <View className="flex-row gap-3">
                <Pressable className="flex-1 rounded-xl bg-white p-4 shadow-sm">
                  <Text className="text-center font-medium text-charcoal-700">
                    My Trips
                  </Text>
                </Pressable>
                <Pressable className="flex-1 rounded-xl bg-white p-4 shadow-sm">
                  <Text className="text-center font-medium text-charcoal-700">
                    Shared Trips
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Recent Trips */}
          <View className="mb-6">
            <Text className="mb-4 text-xl font-semibold text-charcoal-800">
              Recent Trips
            </Text>
            <View className="gap-3">
              {/* Placeholder trip cards */}
              <View className="rounded-xl bg-white p-4 shadow-sm">
                <Text className="text-lg font-semibold text-charcoal-800">
                  Weekend Getaway
                </Text>
                <Text className="mt-1 text-charcoal-600">
                  San Francisco • Nov 15-17, 2024
                </Text>
                <View className="mt-3 flex-row items-center justify-between">
                  <Text className="text-sm text-primary-500">3 days left</Text>
                  <Text className="text-sm text-charcoal-500">2 travelers</Text>
                </View>
              </View>
              
              <View className="rounded-xl bg-white p-4 shadow-sm">
                <Text className="text-lg font-semibold text-charcoal-800">
                  Family Vacation
                </Text>
                <Text className="mt-1 text-charcoal-600">
                  Hawaii • Dec 20-30, 2024
                </Text>
                <View className="mt-3 flex-row items-center justify-between">
                  <Text className="text-sm text-warning-500">Planning</Text>
                  <Text className="text-sm text-charcoal-500">4 travelers</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Trip Statistics */}
          <View className="mb-6">
            <Text className="mb-4 text-xl font-semibold text-charcoal-800">
              Your Travel Stats
            </Text>
            <View className="flex-row gap-3">
              <View className="flex-1 rounded-xl bg-success-50 p-4">
                <Text className="text-2xl font-bold text-success-600">12</Text>
                <Text className="text-success-700">Trips Completed</Text>
              </View>
              <View className="flex-1 rounded-xl bg-primary-50 p-4">
                <Text className="text-2xl font-bold text-primary-600">8</Text>
                <Text className="text-primary-700">Countries Visited</Text>
              </View>
            </View>
          </View>

          {/* Travel Tips */}
          <View className="mb-8">
            <Text className="mb-4 text-xl font-semibold text-charcoal-800">
              Travel Tip of the Day
            </Text>
            <View className="rounded-xl bg-neutral-100 p-4">
              <Text className="text-charcoal-700">
                💡 Pack a portable charger and download offline maps before your trip.
                It can be a lifesaver when exploring new places!
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}