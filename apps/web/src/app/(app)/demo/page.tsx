'use client';

import { useState } from 'react';
import { 
  TripCard, 
  ActivityCard, 
  Header, 
  Screen, 
  ListItem,
  LoadingState,
  ErrorState,
  EmptyState,
  TextField,
  AutoImage,
  Button
} from '@sabron/ui';

export default function DemoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);

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

  return (
    <Screen preset="scroll" className="bg-gray-50">
      <Header 
        title="Component Demo"
        preset="travel"
        showBackButton
        onLeftPress={() => window.history.back()}
        rightIcon="settings"
        onRightPress={() => console.log('Settings pressed')}
      />

      <div className="p-6 space-y-12">
        {/* Trip Cards Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Trip Cards</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {sampleTrips.map((trip, index) => (
              <TripCard
                key={index}
                {...trip}
                preset="travel"
                onPress={() => console.log('Trip pressed:', trip.destination)}
              />
            ))}
          </div>
        </section>

        {/* Activity Cards Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Activity Cards</h2>
          <div className="space-y-4">
            {sampleActivities.map((activity, index) => (
              <ActivityCard
                key={index}
                {...activity}
                preset="travel"
                onPress={() => console.log('Activity pressed:', activity.title)}
              />
            ))}
          </div>
        </section>

        {/* List Items Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">List Items</h2>
          <div className="bg-white rounded-lg overflow-hidden">
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
          </div>
        </section>

        {/* Form Components Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Form Components</h2>
          <div className="bg-white p-6 rounded-lg space-y-4">
            <TextField
              title="Destination"
              placeholder="Where would you like to go?"
              preset="travel"
            />
            <TextField
              title="Travel Dates"
              placeholder="Select your dates"
              preset="travel"
              helper="Choose your departure and return dates"
            />
            <Button preset="travel" className="w-full">
              Search Flights
            </Button>
          </div>
        </section>

        {/* State Components Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">State Components</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Loading State</h3>
              <Button 
                onClick={() => setIsLoading(!isLoading)}
                className="mb-4"
              >
                {isLoading ? 'Hide' : 'Show'} Loading
              </Button>
              {isLoading && (
                <LoadingState
                  preset="travel"
                  message="Searching for flights..."
                  showIcon
                  icon="plane"
                />
              )}
            </div>

            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Error State</h3>
              <Button 
                onClick={() => setShowError(!showError)}
                variant="destructive"
                className="mb-4"
              >
                {showError ? 'Hide' : 'Show'} Error
              </Button>
              {showError && (
                <ErrorState
                  preset="travel"
                  message="Unable to load flight information"
                  onRetry={() => setShowError(false)}
                />
              )}
            </div>

            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Empty State</h3>
              <EmptyState
                preset="travel"
                heading="No trips planned yet"
                content="Start planning your next adventure by searching for destinations"
                button="Plan Your Trip"
                buttonOnPress={() => console.log('Plan trip pressed')}
              />
            </div>
          </div>
        </section>

        {/* Auto Image Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Auto Image</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <AutoImage
              src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=300&h=200&fit=crop"
              alt="Santorini"
              preset="cover"
              className="rounded-lg"
            />
            <AutoImage
              src="https://invalid-url.jpg"
              fallback="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=200&fit=crop"
              alt="Fallback image"
              preset="cover"
              className="rounded-lg"
            />
            <AutoImage
              src=""
              alt="No image"
              preset="placeholder"
              className="rounded-lg"
            />
          </div>
        </section>
      </div>
    </Screen>
  );
}