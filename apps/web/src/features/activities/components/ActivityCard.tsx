'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@sabron/ui';
import { Badge, Button } from '@sabron/ui';
import { Clock, MapPin, DollarSign, Calendar } from 'lucide-react';
import { formatDateTime, formatCurrency, formatDuration } from '@/lib/utils';
import type { Activity } from '@sabron/types';

interface ActivityCardProps {
  activity: Activity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
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
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{activity.title}</CardTitle>
          <Badge className={categoryColors[activity.category as keyof typeof categoryColors]}>
            {activity.category}
          </Badge>
        </div>
        {activity.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{activity.description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formatDateTime(activity.startTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{formatDuration(duration)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{activity.location.name}</span>
          </div>
          {activity.cost && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>{formatCurrency(activity.cost.amount, activity.cost.currency)}</span>
            </div>
          )}
        </div>

        {activity.bookingInfo && (
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Booking Status:</span>
              <Badge variant={activity.bookingInfo.status === 'confirmed' ? 'success' : 'secondary'}>
                {activity.bookingInfo.status}
              </Badge>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline" className="flex-1">
            Edit
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
