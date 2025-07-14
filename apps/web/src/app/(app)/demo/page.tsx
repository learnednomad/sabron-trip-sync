'use client';

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
import { useState } from 'react';

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
    <Screen className="bg-gray-50" preset="scroll">
      <Header 
        showBackButton
        preset="travel"
        rightIcon="settings"
        title="Component Demo"
        onLeftPress={() => window.history.back()}
        onRightPress={() => console.log('Settings pressed')}
      />

      <div className="space-y-12 p-6">
        {/* Trip Cards Section */}
        <section>
          <h2 className="mb-6 text-2xl font-bold">Trip Cards</h2>
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
          <h2 className="mb-6 text-2xl font-bold">Activity Cards</h2>
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
          <h2 className="mb-6 text-2xl font-bold">List Items</h2>
          <div className="overflow-hidden rounded-lg bg-white">
            <ListItem
              leftIcon="plane"
              preset="travel"
              subText="Dec 15, 2024 • 2:30 PM"
              text="Flight Details"
              onPress={() => console.log('Flight pressed')}
            />
            <ListItem
              badge="Confirmed"
              badgeColor="success"
              leftIcon="map-pin"
              preset="travel"
              subText="Grand Resort & Spa"
              text="Hotel Reservation"
              onPress={() => console.log('Hotel pressed')}
            />
            <ListItem
              leftIcon="star"
              preset="travel"
              subText="Comprehensive coverage"
              text="Travel Insurance"
              onPress={() => console.log('Insurance pressed')}
            />
          </div>
        </section>

        {/* Form Components Section */}
        <section>
          <h2 className="mb-6 text-2xl font-bold">Form Components</h2>
          <div className="space-y-4 rounded-lg bg-white p-6">
            <TextField
              placeholder="Where would you like to go?"
              preset="travel"
              title="Destination"
            />
            <TextField
              helper="Choose your departure and return dates"
              placeholder="Select your dates"
              preset="travel"
              title="Travel Dates"
            />
            <Button className="w-full" preset="travel">
              Search Flights
            </Button>
          </div>
        </section>

        {/* State Components Section */}
        <section>
          <h2 className="mb-6 text-2xl font-bold">State Components</h2>
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold">Loading State</h3>
              <Button 
                className="mb-4"
                onClick={() => setIsLoading(!isLoading)}
              >
                {isLoading ? 'Hide' : 'Show'} Loading
              </Button>
              {isLoading && (
                <LoadingState
                  showIcon
                  icon="plane"
                  message="Searching for flights..."
                  preset="travel"
                />
              )}
            </div>

            <div className="rounded-lg bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold">Error State</h3>
              <Button 
                className="mb-4"
                variant="destructive"
                onClick={() => setShowError(!showError)}
              >
                {showError ? 'Hide' : 'Show'} Error
              </Button>
              {showError && (
                <ErrorState
                  message="Unable to load flight information"
                  preset="travel"
                  onRetry={() => setShowError(false)}
                />
              )}
            </div>

            <div className="rounded-lg bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold">Empty State</h3>
              <EmptyState
                button="Plan Your Trip"
                buttonOnPress={() => console.log('Plan trip pressed')}
                content="Start planning your next adventure by searching for destinations"
                heading="No trips planned yet"
                preset="travel"
              />
            </div>
          </div>
        </section>

        {/* Auto Image Section */}
        <section>
          <h2 className="mb-6 text-2xl font-bold">Auto Image</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <AutoImage
              alt="Santorini"
              className="rounded-lg"
              preset="cover"
              src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=300&h=200&fit=crop"
            />
            <AutoImage
              alt="Fallback image"
              className="rounded-lg"
              fallback="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=200&fit=crop"
              preset="cover"
              src="https://invalid-url.jpg"
            />
            <AutoImage
              alt="No image"
              className="rounded-lg"
              preset="placeholder"
              src=""
            />
          </div>
        </section>
      </div>
    </Screen>
  );
}