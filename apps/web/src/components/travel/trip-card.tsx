'use client';

import Image from 'next/image';
import { Calendar, MapPin, Users, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

export function TripCard({ 
  trip, 
  className,
  onEdit,
  onCancel,
  onView
}: TripCardProps) {
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
            src={trip.image}
            alt={trip.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          
          <div className="absolute top-4 right-4">
            <Badge className={cn("capitalize", statusVariants[trip.status])}>
              {trip.status}
            </Badge>
          </div>

          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-xl font-bold mb-1">{trip.title}</h3>
            <div className="flex items-center gap-1 text-sm">
              <MapPin className="h-4 w-4" />
              <span>{trip.destination}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Calendar className="h-4 w-4" />
          <span>
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div className="flex -space-x-2">
              {displayedTravelers.map((traveler) => (
                <Avatar 
                  key={traveler.id} 
                  className="h-8 w-8 border-2 border-background"
                >
                  <AvatarImage src={traveler.avatar} alt={traveler.name} />
                  <AvatarFallback className="text-xs">
                    {getInitials(traveler.name)}
                  </AvatarFallback>
                </Avatar>
              ))}
              {remainingTravelers > 0 && (
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
                  +{remainingTravelers}
                </div>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
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

      <CardFooter className="p-4 pt-0 border-t">
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