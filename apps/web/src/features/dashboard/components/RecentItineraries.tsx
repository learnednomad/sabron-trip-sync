'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@sabron/ui';
import { Button, Badge } from '@sabron/ui';
import { formatDate } from '@/lib/utils';
import { useItineraries } from '@/lib/api-client';
import { ArrowRight } from 'lucide-react';

export function RecentItineraries() {
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
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
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
        <Button variant="ghost" size="sm" asChild>
          <Link href="/itineraries">
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {recentItineraries.length > 0 ? (
          <div className="space-y-4">
            {recentItineraries.map((itinerary) => (
              <div key={itinerary.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors">
                <div className="flex-1">
                  <Link
                    href={`/itineraries/${itinerary.id}`}
                    className="font-medium text-foreground hover:text-primary"
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
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">No itineraries yet</p>
            <Button asChild>
              <Link href="/itineraries">Create Your First Trip</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
