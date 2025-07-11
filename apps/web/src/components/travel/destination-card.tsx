'use client';

import Image from 'next/image';
import { MapPin, Star, Heart } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

export function DestinationCard({ 
  destination, 
  className,
  onLike,
  onClick 
}: DestinationCardProps) {
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
          src={destination.image}
          alt={destination.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <Button
          size="icon"
          variant="ghost"
          className={cn(
            "absolute top-4 right-4 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white",
            destination.liked && "text-red-500"
          )}
          onClick={handleLikeClick}
        >
          <Heart className={cn("h-5 w-5", destination.liked && "fill-current")} />
        </Button>

        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex flex-wrap gap-2">
            {destination.tags.map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary"
                className="bg-white/90 backdrop-blur-sm text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{destination.name}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{destination.country}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-medium text-sm">{destination.rating}</span>
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