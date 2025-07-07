'use client';

import { DashboardStats } from '@/features/dashboard/components/DashboardStats';
import { RecentItineraries } from '@/features/dashboard/components/RecentItineraries';
import { useAuth } from '@/providers/auth-provider';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Welcome back{user?.user_metadata?.name ? `, ${user.user_metadata.name}` : ''}!
        </h1>
        <p className="mt-2 text-muted-foreground">
          Here's what's happening with your trips.
        </p>
      </div>

      <DashboardStats />

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentItineraries />

        <div className="bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg p-6">
          <h3 className="text-lg font-medium text-foreground mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a
              href="/itineraries"
              className="block p-3 bg-card rounded-md shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="font-medium text-foreground">Plan a New Trip</div>
              <div className="text-sm text-muted-foreground">Create a detailed itinerary</div>
            </a>
            <a
              href="/activities"
              className="block p-3 bg-card rounded-md shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="font-medium text-foreground">Browse Activities</div>
              <div className="text-sm text-muted-foreground">Discover things to do</div>
            </a>
            <a
              href="/bookings"
              className="block p-3 bg-card rounded-md shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="font-medium text-foreground">Manage Bookings</div>
              <div className="text-sm text-muted-foreground">View confirmations</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
