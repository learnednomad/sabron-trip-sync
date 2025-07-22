'use client';

import { Card, CardContent, CardHeader, CardTitle , Button, Badge } from '@sabron/ui';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { useItineraries } from '@/lib/api-client';
import { formatDate } from '@/lib/utils';

export const RecentItineraries = () => {
  const { data: itineraries, isLoading } = useItineraries();

  const recentItineraries = itineraries?.items.slice(0, 3) || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Itineraries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="mb-2 h-4 w-3/4 rounded bg-muted" />
                <div className="h-3 w-1/2 rounded bg-muted" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Itineraries</CardTitle>
        <Button asChild size="sm" variant="ghost">
          <Link href="/itineraries">
            View All
            <ArrowRight className="ml-1 size-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {recentItineraries.length > 0 ? (
          <div className="space-y-4">
            {recentItineraries.map((itinerary) => (
              <div key={itinerary.id} className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent">
                <div className="flex-1">
                  <Link
                    className="font-medium text-foreground hover:text-primary"
                    href={`/itineraries/${itinerary.id}`}
                  >
                    {itinerary.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {itinerary.destinations[0]?.name} • {formatDate(itinerary.startDate)}
                  </p>
                </div>
                <Badge variant={itinerary.status === 'active' ? 'success' : 'secondary'}>
                  {itinerary.status}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center">
            <p className="mb-4 text-muted-foreground">No itineraries yet</p>
            <Button asChild>
              <Link href="/itineraries">Create Your First Trip</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
