'use client';

import { Calendar, MapPin, Users, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn, formatDate, getInitials, formatCurrency } from '@/lib/utils';

interface TripCardProps {
  trip: {
    id: string;
    title: string;
    destination: string;
    image: string;
    startDate: Date;
    endDate: Date;
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    travelers: {
      id: string;
      name: string;
      avatar?: string;
    }[];
    price: number;
    currency: string;
  };
  className?: string;
  onEdit?: (id: string) => void;
  onCancel?: (id: string) => void;
  onView?: (id: string) => void;
}

const statusVariants = {
  upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  ongoing: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  completed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export const TripCard = ({ 
  trip, 
  className,
  onEdit,
  onCancel,
  onView
}: TripCardProps) => {
  const displayedTravelers = trip.travelers.slice(0, 3);
  const remainingTravelers = trip.travelers.length - 3;

  return (
    <Card 
      className={cn(
        "group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer",
        className
      )}
      onClick={() => onView?.(trip.id)}
    >
      <CardHeader className="p-0">
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            fill
            alt={trip.title}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            src={trip.image}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          
          <div className="absolute right-4 top-4">
            <Badge className={cn("capitalize", statusVariants[trip.status])}>
              {trip.status}
            </Badge>
          </div>

          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="mb-1 text-xl font-bold">{trip.title}</h3>
            <div className="flex items-center gap-1 text-sm">
              <MapPin className="size-4" />
              <span>{trip.destination}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="size-4" />
          <span>
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-muted-foreground" />
            <div className="flex -space-x-2">
              {displayedTravelers.map((traveler) => (
                <Avatar 
                  key={traveler.id} 
                  className="size-8 border-2 border-background"
                >
                  <AvatarImage alt={traveler.name} src={traveler.avatar} />
                  <AvatarFallback className="text-xs">
                    {getInitials(traveler.name)}
                  </AvatarFallback>
                </Avatar>
              ))}
              {remainingTravelers > 0 && (
                <div className="flex size-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                  +{remainingTravelers}
                </div>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button className="size-8" size="icon" variant="ghost">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onView?.(trip.id);
              }}>
                View Details
              </DropdownMenuItem>
              {trip.status === 'upcoming' && (
                <>
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(trip.id);
                  }}>
                    Edit Trip
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCancel?.(trip.id);
                    }}
                  >
                    Cancel Trip
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>

      <CardFooter className="border-t p-4 pt-0">
        <div className="flex items-baseline gap-1">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="text-xl font-bold">
            {formatCurrency(trip.price, trip.currency)}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}