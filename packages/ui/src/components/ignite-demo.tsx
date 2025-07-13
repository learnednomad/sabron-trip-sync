import { Button } from './ui/button';
import { AutoImage } from './ui/auto-image';
import { EmptyState } from './ui/empty-state';
import { TextField } from './ui/text-field';
import { Header } from './ui/header';
import { Screen } from './ui/screen';
import { ListItem } from './ui/list-item';
import { LoadingState } from './ui/loading-state';
import { ErrorState } from './ui/error-state';
import { TripCard } from './ui/trip-card';
import { ActivityCard } from './ui/activity-card';
import { MapPin } from 'lucide-react';

export function IgniteDemoComponents() {
  return (
    <Screen preset="scroll" className="bg-background">
      <Header
        titleTx="demo:title"
        title="Ignite CLI Components"
        preset="travel"
        rightIcon="settings"
        onRightPress={() => alert('Settings')}
      />
      
      <div className="space-y-8 p-6">
        {/* Form Components */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Form Components</h2>
          <div className="space-y-4 max-w-md">
            <TextField
              label="Destination"
              labelTx="form:destination"
              placeholder="Where would you like to go?"
              placeholderTx="form:destinationPlaceholder"
              preset="travel"
            />
            
            <TextField
              label="Email Address"
              placeholder="Enter your email"
              type="email"
              status="error"
              error="Please enter a valid email address"
              required
            />
          </div>
        </section>

        {/* Enhanced Button with Presets */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Enhanced Buttons</h2>
          <div className="flex gap-4 flex-wrap">
            <Button preset="primary" text="Primary Action" />
            <Button preset="secondary" text="Secondary Action" />
            <Button preset="travel" text="Book Trip" />
            <Button preset="danger" text="Cancel Booking" />
            <Button preset="success" text="Trip Confirmed" />
          </div>
        </section>

        {/* List Components */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">List Items</h2>
          <div className="border rounded-lg overflow-hidden">
            <ListItem
              text="My Recent Trips"
              subText="View your travel history"
              leftIcon="map-pin"
              preset="travel"
              onPress={() => alert('Navigate to trips')}
            />
            <ListItem
              text="Upcoming Adventures"
              subText="3 trips planned"
              leftIcon="calendar"
              badge="3"
              badgeColor="info"
              onPress={() => alert('Navigate to upcoming')}
            />
            <ListItem
              text="Travel Settings"
              subText="Preferences and notifications"
              leftIcon="star"
              onPress={() => alert('Navigate to settings')}
            />
          </div>
        </section>

        {/* State Components */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">State Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <LoadingState
                preset="travel"
                message="Loading your trips..."
                size="small"
                showIcon
                icon="plane"
              />
            </div>
            
            <div className="border rounded-lg p-4">
              <ErrorState
                preset="travel"
                title="Connection Error"
                message="Unable to load trips"
                errorType="network"
                onRetry={() => alert('Retrying...')}
                size="small"
              />
            </div>
            
            <div className="border rounded-lg p-4">
              <EmptyState
                preset="travel"
                icon={<MapPin />}
                heading="No trips yet"
                content="Start planning your adventure"
                button="Plan Trip"
                buttonPreset="travel"
                buttonOnPress={() => alert('Plan trip')}
                size="default"
              />
            </div>
          </div>
        </section>

        {/* Travel Components */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Travel Components</h2>
          
          {/* Trip Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TripCard
              destination="Paris, France"
              dates="Mar 15-22, 2024"
              duration="7 days"
              status="upcoming"
              preset="travel"
              imageUrl="https://images.unsplash.com/photo-1502602898536-47ad22581b52"
              showBudget
              budget={2500}
              currency="USD"
              participants={2}
              showParticipants
              onPress={() => alert('View Paris trip')}
            />
            
            <TripCard
              destination="Tokyo, Japan"
              dates="Jun 1-10, 2024"
              duration="9 days"
              status="planning"
              preset="elevated"
              layout="horizontal"
              size="small"
              onPress={() => alert('View Tokyo trip')}
            />
          </div>
          
          {/* Activity Cards */}
          <div className="space-y-3">
            <ActivityCard
              title="Visit Eiffel Tower"
              description="Iconic landmark and city views"
              time="14:00 - 16:00"
              duration="2 hours"
              location="Champ de Mars, Paris"
              category="sightseeing"
              status="confirmed"
              preset="travel"
              showRating
              rating={4.5}
              showCost
              cost={25}
              currency="EUR"
              onPress={() => alert('View activity details')}
            />
            
            <ActivityCard
              title="Seine River Cruise"
              description="Romantic evening cruise with dinner"
              time="19:30"
              location="Port de la Bourdonnais"
              category="food"
              status="planned"
              preset="timeline"
              showParticipants
              participants={2}
              onPress={() => alert('View cruise details')}
            />
          </div>
        </section>

        {/* AutoImage Gallery */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Travel Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <AutoImage
              src="https://images.unsplash.com/photo-1469474968028-56623f02e42e"
              alt="Mountain landscape"
              preset="cover"
              aspectRatio="square"
              fallback="https://via.placeholder.com/300x300?text=Mountain"
            />
            <AutoImage
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4"
              alt="Ocean view"
              preset="cover"
              aspectRatio="square"
            />
            <AutoImage
              src="https://images.unsplash.com/photo-1500375592092-40eb2168fd21"
              alt="City skyline"
              preset="cover"
              aspectRatio="square"
            />
            <AutoImage
              src="https://broken-url.jpg"
              alt="Will show fallback"
              preset="cover"
              aspectRatio="square"
              fallback="https://via.placeholder.com/300x300?text=No+Image"
            />
          </div>
        </section>
      </div>
    </Screen>
  );
}