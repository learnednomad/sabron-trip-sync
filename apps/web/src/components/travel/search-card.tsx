'use client';

import { useState } from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn, formatDate } from '@/lib/utils';
import { addDays } from 'date-fns';

interface SearchCardProps {
  onSearch?: (data: {
    destination: string;
    checkIn: Date | undefined;
    checkOut: Date | undefined;
    guests: string;
  }) => void;
  className?: string;
}

export function SearchCard({ onSearch, className }: SearchCardProps) {
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState('2');

  const handleSearch = () => {
    onSearch?.({
      destination,
      checkIn,
      checkOut,
      guests,
    });
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-6">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-1">
            <Label htmlFor="destination" className="mb-2 block">
              <MapPin className="inline h-4 w-4 mr-1" />
              Destination
            </Label>
            <Input
              id="destination"
              placeholder="Where to?"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="md:col-span-1">
            <Label className="mb-2 block">
              <Calendar className="inline h-4 w-4 mr-1" />
              Check-in
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !checkIn && "text-muted-foreground"
                  )}
                >
                  {checkIn ? formatDate(checkIn) : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={checkIn}
                  onSelect={setCheckIn}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="md:col-span-1">
            <Label className="mb-2 block">
              <Calendar className="inline h-4 w-4 mr-1" />
              Check-out
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !checkOut && "text-muted-foreground"
                  )}
                >
                  {checkOut ? formatDate(checkOut) : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={checkOut}
                  onSelect={setCheckOut}
                  disabled={(date) => {
                    if (date < new Date()) return true;
                    if (checkIn && date < addDays(checkIn, 1)) return true;
                    return false;
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="md:col-span-1">
            <Label htmlFor="guests" className="mb-2 block">
              <Users className="inline h-4 w-4 mr-1" />
              Guests
            </Label>
            <Select value={guests} onValueChange={setGuests}>
              <SelectTrigger id="guests">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Guest</SelectItem>
                <SelectItem value="2">2 Guests</SelectItem>
                <SelectItem value="3">3 Guests</SelectItem>
                <SelectItem value="4">4 Guests</SelectItem>
                <SelectItem value="5">5+ Guests</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={handleSearch}
          size="lg"
          className="w-full mt-6"
        >
          <Search className="h-4 w-4 mr-2" />
          Search Trips
        </Button>
      </CardContent>
    </Card>
  );
}