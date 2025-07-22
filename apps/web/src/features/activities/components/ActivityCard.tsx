'use client';

import { Card, CardContent, CardHeader, CardTitle , Badge, Button } from '@sabron/ui';
import { Clock, MapPin, DollarSign, Calendar } from 'lucide-react';

import { formatDateTime, formatCurrency, formatDuration } from '@/lib/utils';

import type { Activity } from '@sabron/types';

interface ActivityCardProps {
  activity: Activity;
}

export const ActivityCard = ({ activity }: ActivityCardProps) => {
  const categoryColors = {
    dining: 'bg-orange-100 text-orange-800',
    attraction: 'bg-blue-100 text-blue-800',
    transport: 'bg-green-100 text-green-800',
    accommodation: 'bg-purple-100 text-purple-800',
    shopping: 'bg-pink-100 text-pink-800',
    entertainment: 'bg-yellow-100 text-yellow-800',
    other: 'bg-muted text-muted-foreground',
  };

  const duration = Math.floor((new Date(activity.endTime).getTime() - new Date(activity.startTime).getTime()) / (1000 * 60));

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{activity.title}</CardTitle>
          <Badge className={categoryColors[activity.category as keyof typeof categoryColors]}>
            {activity.category}
          </Badge>
        </div>
        {activity.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{activity.description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-muted-foreground" />
            <span>{formatDateTime(activity.startTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-muted-foreground" />
            <span>{formatDuration(duration)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-muted-foreground" />
            <span className="truncate">{activity.location.name}</span>
          </div>
          {activity.cost && (
            <div className="flex items-center gap-2">
              <DollarSign className="size-4 text-muted-foreground" />
              <span>{formatCurrency(activity.cost.amount, activity.cost.currency)}</span>
            </div>
          )}
        </div>

        {activity.bookingInfo && (
          <div className="border-t pt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Booking Status:</span>
              <Badge variant={activity.bookingInfo.status === 'confirmed' ? 'success' : 'secondary'}>
                {activity.bookingInfo.status}
              </Badge>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button className="flex-1" size="sm" variant="outline">
            Edit
          </Button>
          <Button className="flex-1" size="sm" variant="outline">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
