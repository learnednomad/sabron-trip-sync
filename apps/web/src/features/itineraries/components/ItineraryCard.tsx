'use client';

import { Card, CardContent, CardHeader, CardTitle , Badge , Button } from '@sabron/ui';
import { Calendar, MapPin, Users, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

import { formatDate, formatCurrency } from '@/lib/utils';

import type { Itinerary } from '@sabron/types';

interface ItineraryCardProps {
  itinerary: Itinerary;
}

export const ItineraryCard = ({ itinerary }: ItineraryCardProps) => {
  const statusColor = {
    draft: 'secondary',
    planned: 'default',
    active: 'success',
    completed: 'outline',
    cancelled: 'destructive',
  } as const;

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">
              <Link
                className="transition-colors hover:text-primary/80"
                href={`/itineraries/${itinerary.id}`}
              >
                {itinerary.title}
              </Link>
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4" />
              {itinerary.destinations[0]?.name}, {itinerary.destinations[0]?.country}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={statusColor[itinerary.status as keyof typeof statusColor]}>
              {itinerary.status}
            </Badge>
            <Button size="icon" variant="ghost">
              <MoreHorizontal className="size-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-muted-foreground" />
            <span>{formatDate(itinerary.startDate)} - {formatDate(itinerary.endDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="size-4 text-muted-foreground" />
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
          <Button asChild className="flex-1" size="sm">
            <Link href={`/itineraries/${itinerary.id}`}>View Details</Link>
          </Button>
          <Button className="flex-1" size="sm" variant="outline">Edit</Button>
        </div>
      </CardContent>
    </Card>
  );
}
