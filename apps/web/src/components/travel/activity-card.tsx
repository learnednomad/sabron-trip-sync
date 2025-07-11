'use client';

import Image from 'next/image';
import { Clock, MapPin, Star, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn, formatDuration, formatCurrency } from '@/lib/utils';

interface ActivityCardProps {
  activity: {
    id: string;
    title: string;
    location: string;
    image: string;
    duration: number; // in minutes
    rating: number;
    reviews: number;
    price: number;
    currency: string;
    category: string;
    groupSize: {
      min: number;
      max: number;
    };
    popular?: boolean;
    soldOut?: boolean;
  };
  variant?: 'default' | 'compact';
  className?: string;
  onBook?: (id: string) => void;
}

export function ActivityCard({ 
  activity, 
  variant = 'default',
  className,
  onBook
}: ActivityCardProps) {
  if (variant === 'compact') {
    return (
      <Card className={cn("group overflow-hidden hover:shadow-md transition-all duration-300", className)}>
        <div className="flex gap-4 p-4">
          <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
            <Image
              src={activity.image}
              alt={activity.title}
              fill
              className="object-cover"
            />
            {activity.popular && (
              <Badge className="absolute top-1 left-1 text-xs" variant="secondary">
                Popular
              </Badge>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium line-clamp-1 mb-1">{activity.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <MapPin className="h-3 w-3" />
              <span className="line-clamp-1">{activity.location}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatDuration(activity.duration)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span>{activity.rating}</span>
                </div>
              </div>
              <span className="font-semibold">
                {formatCurrency(activity.price, activity.currency)}
              </span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("group overflow-hidden hover:shadow-lg transition-all duration-300", className)}>
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={activity.image}
          alt={activity.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
          <Badge variant="secondary" className="capitalize">
            {activity.category}
          </Badge>
          {activity.popular && (
            <Badge className="bg-travel-coral text-white border-0">
              Popular Choice
            </Badge>
          )}
        </div>

        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="text-lg font-semibold mb-1 line-clamp-2">{activity.title}</h3>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4" />
            <span>{activity.location}</span>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{formatDuration(activity.duration)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{activity.groupSize.min}-{activity.groupSize.max} people</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-medium">{activity.rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            ({activity.reviews} reviews)
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-muted-foreground">From</span>
            <p className="text-xl font-bold">
              {formatCurrency(activity.price, activity.currency)}
            </p>
          </div>
          <Button 
            onClick={() => onBook?.(activity.id)}
            disabled={activity.soldOut}
            className="min-w-[100px]"
          >
            {activity.soldOut ? 'Sold Out' : 'Book Now'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}