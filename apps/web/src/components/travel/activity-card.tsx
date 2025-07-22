'use client';

import { Clock, MapPin, Star, Users } from 'lucide-react';
import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

export const ActivityCard = ({ 
  activity, 
  variant = 'default',
  className,
  onBook
}: ActivityCardProps) => {
  if (variant === 'compact') {
    return (
      <Card className={cn("group overflow-hidden hover:shadow-md transition-all duration-300", className)}>
        <div className="flex gap-4 p-4">
          <div className="relative size-24 shrink-0 overflow-hidden rounded-lg">
            <Image
              fill
              alt={activity.title}
              className="object-cover"
              src={activity.image}
            />
            {activity.popular && (
              <Badge className="absolute left-1 top-1 text-xs" variant="secondary">
                Popular
              </Badge>
            )}
          </div>
          
          <div className="min-w-0 flex-1">
            <h3 className="mb-1 line-clamp-1 font-medium">{activity.title}</h3>
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-3" />
              <span className="line-clamp-1">{activity.location}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="size-3" />
                  <span>{formatDuration(activity.duration)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="size-3 fill-amber-400 text-amber-400" />
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
          fill
          alt={activity.title}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          src={activity.image}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        <div className="absolute inset-x-4 top-4 flex items-start justify-between">
          <Badge className="capitalize" variant="secondary">
            {activity.category}
          </Badge>
          {activity.popular && (
            <Badge className="border-0 bg-travel-coral text-white">
              Popular Choice
            </Badge>
          )}
        </div>

        <div className="absolute inset-x-4 bottom-4 text-white">
          <h3 className="mb-1 line-clamp-2 text-lg font-semibold">{activity.title}</h3>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="size-4" />
            <span>{activity.location}</span>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="size-4 text-muted-foreground" />
              <span>{formatDuration(activity.duration)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="size-4 text-muted-foreground" />
              <span>{activity.groupSize.min}-{activity.groupSize.max} people</span>
            </div>
          </div>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="size-4 fill-amber-400 text-amber-400" />
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
            className="min-w-[100px]"
            disabled={activity.soldOut}
            onClick={() => onBook?.(activity.id)}
          >
            {activity.soldOut ? 'Sold Out' : 'Book Now'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}