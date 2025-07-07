'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@sabron/ui';
import { Badge } from '@sabron/ui';
import { Button } from '@sabron/ui';
import { Calendar, MapPin, Users, MoreHorizontal } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';
import type { Itinerary } from '@sabron/types';

interface ItineraryCardProps {
  itinerary: Itinerary;
}

export function ItineraryCard({ itinerary }: ItineraryCardProps) {
  const statusColor = {
    draft: 'secondary',
    planned: 'default',
    active: 'success',
    completed: 'outline',
    cancelled: 'destructive',
  } as const;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">
              <Link
                href={`/itineraries/${itinerary.id}`}
                className="hover:text-primary/80 transition-colors"
              >
                {itinerary.title}
              </Link>
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {itinerary.destinations[0]?.name}, {itinerary.destinations[0]?.country}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={statusColor[itinerary.status as keyof typeof statusColor]}>
              {itinerary.status}
            </Badge>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formatDate(itinerary.startDate)} - {formatDate(itinerary.endDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{itinerary.travelers.length} traveler{itinerary.travelers.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <span className="font-medium">Budget: </span>
            <span>{formatCurrency(itinerary.budget?.total.amount || 0, itinerary.budget?.total.currency)}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {itinerary.activities.length} activities
          </div>
        </div>

        <div className="flex gap-2">
          <Button asChild size="sm" className="flex-1">
            <Link href={`/itineraries/${itinerary.id}`}>View Details</Link>
          </Button>
          <Button variant="outline" size="sm" className="flex-1">Edit</Button>
        </div>
      </CardContent>
    </Card>
  );
}
