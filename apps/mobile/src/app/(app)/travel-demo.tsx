import * as React from 'react';
import { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { 
  TripCard, 
  ActivityCard, 
  Header, 
  Screen, 
  ListItem,
  LoadingState,
  ErrorState,
  EmptyState,
  TextField
} from '@/components/travel';
import { Text, Button } from '@/components/ui';

export default function TravelDemoScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [searchText, setSearchText] = useState('');

  const sampleTrips = [
    {
      destination: 'Santorini, Greece',
      dates: 'Dec 15-22, 2024',
      duration: '7 days',
      status: 'upcoming' as const,
      imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=250&fit=crop',
      participants: 2,
      budget: 1500,
      showBudget: true,
      showParticipants: true,
    },
    {
      destination: 'Tokyo, Japan',
      dates: 'Jan 10-20, 2025',
      duration: '10 days',
      status: 'planning' as const,
      imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=250&fit=crop',
      participants: 4,
      budget: 3200,
      showBudget: true,
      showParticipants: true,
    }
  ];

  const sampleActivities = [
    {
      title: 'Sunset Wine Tasting',
      description: 'Experience the famous Santorini sunset while tasting local wines',
      category: 'food' as const,
      status: 'confirmed' as const,
      startTime: new Date('2024-12-16T18:00:00'),
      endTime: new Date('2024-12-16T21:00:00'),
      location: 'Oia, Santorini',
      cost: 85,
      rating: 4.8,
      participants: 2,
      showTime: true,
      showLocation: true,
      showCost: true,
      showRating: true,
    },
    {
      title: 'Temple Walking Tour',
      description: 'Guided tour through ancient temples and traditional neighborhoods',
      category: 'sightseeing' as const,
      status: 'planned' as const,
      startTime: new Date('2025-01-12T09:00:00'),
      endTime: new Date('2025-01-12T15:00:00'),
      location: 'Asakusa, Tokyo',
      cost: 45,
      rating: 4.9,
      participants: 4,
      showTime: true,
      showLocation: true,
      showCost: true,
      showRating: true,
    }
  ];

  const renderSection = (title: string, children: React.ReactNode) => (
    <View className="mb-8">
      <Text className="text-xl font-bold mb-4 px-4">{title}</Text>
      {children}
    </View>
  );

  return (
    <Screen preset="scroll" safeAreaEdges="all">
      <Header 
        title="Component Demo"
        preset="travel"
        showBackButton
        onLeftPress={() => console.log('Back pressed')}
        rightIcon="settings"
        onRightPress={() => console.log('Settings pressed')}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Trip Cards Section */}
        {renderSection('Trip Cards', (
          <View className="px-4 space-y-4">
            {sampleTrips.map((trip, index) => (
              <TripCard
                key={index}
                {...trip}
                preset="travel"
                onPress={() => console.log('Trip pressed:', trip.destination)}
              />
            ))}
          </View>
        ))}

        {/* Activity Cards Section */}
        {renderSection('Activity Cards', (
          <View className="px-4 space-y-4">
            {sampleActivities.map((activity, index) => (
              <ActivityCard
                key={index}
                {...activity}
                preset="travel"
                onPress={() => console.log('Activity pressed:', activity.title)}
              />
            ))}
          </View>
        ))}

        {/* List Items Section */}
        {renderSection('List Items', (
          <View className="mx-4 bg-white rounded-lg overflow-hidden">
            <ListItem
              text="Flight Details"
              subText="Dec 15, 2024 • 2:30 PM"
              leftIcon="plane"
              preset="travel"
              onPress={() => console.log('Flight pressed')}
            />
            <ListItem
              text="Hotel Reservation"
              subText="Grand Resort & Spa"
              leftIcon="map-pin"
              preset="travel"
              badge="Confirmed"
              badgeColor="success"
              onPress={() => console.log('Hotel pressed')}
            />
            <ListItem
              text="Travel Insurance"
              subText="Comprehensive coverage"
              leftIcon="star"
              preset="travel"
              onPress={() => console.log('Insurance pressed')}
            />
          </View>
        ))}

        {/* Form Components Section */}
        {renderSection('Form Components', (
          <View className="px-4 space-y-4">
            <TextField
              title="Destination"
              placeholder="Where would you like to go?"
              preset="travel"
              value={searchText}
              onChangeText={setSearchText}
            />
            <TextField
              title="Travel Dates"
              placeholder="Select your dates"
              preset="travel"
              helper="Choose your departure and return dates"
            />
            <Button 
              className="bg-gradient-to-r from-blue-500 to-purple-600"
              onPress={() => console.log('Search pressed')}
            >
              <Text className="text-white font-medium">Search Flights</Text>
            </Button>
          </View>
        ))}

        {/* State Components Section */}
        {renderSection('State Components', (
          <View className="px-4 space-y-6">
            <View className="bg-white p-4 rounded-lg">
              <Text className="text-lg font-semibold mb-4">Loading State</Text>
              <Button 
                onPress={() => setIsLoading(!isLoading)}
                className="mb-4"
              >
                <Text className="text-white">
                  {isLoading ? 'Hide' : 'Show'} Loading
                </Text>
              </Button>
              {isLoading && (
                <LoadingState
                  preset="travel"
                  message="Searching for flights..."
                  showIcon
                  icon="plane"
                />
              )}
            </View>

            <View className="bg-white p-4 rounded-lg">
              <Text className="text-lg font-semibold mb-4">Error State</Text>
              <Button 
                onPress={() => setShowError(!showError)}
                className="mb-4 bg-red-600"
              >
                <Text className="text-white">
                  {showError ? 'Hide' : 'Show'} Error
                </Text>
              </Button>
              {showError && (
                <ErrorState
                  preset="travel"
                  message="Unable to load flight information"
                  onRetry={() => setShowError(false)}
                />
              )}
            </View>

            <View className="bg-white p-4 rounded-lg">
              <Text className="text-lg font-semibold mb-4">Empty State</Text>
              <EmptyState
                preset="travel"
                heading="No trips planned yet"
                content="Start planning your next adventure by searching for destinations"
                button="Plan Your Trip"
                buttonOnPress={() => console.log('Plan trip pressed')}
                icon="map"
              />
            </View>
          </View>
        ))}

        {/* Bottom spacing */}
        <View className="h-8" />
      </ScrollView>
    </Screen>
  );
}