'use client';

import { MapPin, Star, Heart } from 'lucide-react';
import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { cn, formatCurrency } from '@/lib/utils';

interface DestinationCardProps {
  destination: {
    id: string;
    name: string;
    country: string;
    image: string;
    rating: number;
    reviews: number;
    price: number;
    currency: string;
    tags: string[];
    liked?: boolean;
  };
  className?: string;
  onLike?: (id: string) => void;
  onClick?: (id: string) => void;
}

export const DestinationCard = ({ 
  destination, 
  className,
  onLike,
  onClick 
}: DestinationCardProps) => {
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike?.(destination.id);
  };

  return (
    <Card 
      className={cn(
        "group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1",
        className
      )}
      onClick={() => onClick?.(destination.id)}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          fill
          alt={destination.name}
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          src={destination.image}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        <Button
          className={cn(
            "absolute top-4 right-4 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white",
            destination.liked && "text-red-500"
          )}
          size="icon"
          variant="ghost"
          onClick={handleLikeClick}
        >
          <Heart className={cn("h-5 w-5", destination.liked && "fill-current")} />
        </Button>

        <div className="absolute inset-x-4 bottom-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex flex-wrap gap-2">
            {destination.tags.map((tag) => (
              <Badge 
                key={tag} 
                className="bg-white/90 text-xs backdrop-blur-sm"
                variant="secondary"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h3 className="line-clamp-1 text-lg font-semibold">{destination.name}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-3" />
              <span>{destination.country}</span>
            </div>
          </div>
        </div>

        <div className="mb-3 flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="size-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium">{destination.rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            ({destination.reviews.toLocaleString()} reviews)
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex items-baseline gap-1">
          <span className="text-sm text-muted-foreground">From</span>
          <span className="text-2xl font-bold text-primary">
            {formatCurrency(destination.price, destination.currency)}
          </span>
          <span className="text-sm text-muted-foreground">per person</span>
        </div>
      </CardFooter>
    </Card>
  );
}