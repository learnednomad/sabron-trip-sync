'use client';

import { addDays } from 'date-fns';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn, formatDate } from '@/lib/utils';


interface SearchCardProps {
  onSearch?: (data: {
    destination: string;
    checkIn: Date | undefined;
    checkOut: Date | undefined;
    guests: string;
  }) => void;
  className?: string;
}

export const SearchCard = ({ onSearch, className }: SearchCardProps) => {
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
            <Label className="mb-2 block" htmlFor="destination">
              <MapPin className="mr-1 inline size-4" />
              Destination
            </Label>
            <Input
              className="w-full"
              id="destination"
              placeholder="Where to?"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>

          <div className="md:col-span-1">
            <Label className="mb-2 block">
              <Calendar className="mr-1 inline size-4" />
              Check-in
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !checkIn && "text-muted-foreground"
                  )}
                  variant="outline"
                >
                  {checkIn ? formatDate(checkIn) : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0">
                <CalendarComponent
                  initialFocus
                  disabled={(date) => date < new Date()}
                  mode="single"
                  selected={checkIn}
                  onSelect={setCheckIn}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="md:col-span-1">
            <Label className="mb-2 block">
              <Calendar className="mr-1 inline size-4" />
              Check-out
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !checkOut && "text-muted-foreground"
                  )}
                  variant="outline"
                >
                  {checkOut ? formatDate(checkOut) : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0">
                <CalendarComponent
                  initialFocus
                  disabled={(date) => {
                    if (date < new Date()) return true;
                    if (checkIn && date < addDays(checkIn, 1)) return true;
                    return false;
                  }}
                  mode="single"
                  selected={checkOut}
                  onSelect={setCheckOut}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="md:col-span-1">
            <Label className="mb-2 block" htmlFor="guests">
              <Users className="mr-1 inline size-4" />
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
          className="mt-6 w-full"
          size="lg"
          onClick={handleSearch}
        >
          <Search className="mr-2 size-4" />
          Search Trips
        </Button>
      </CardContent>
    </Card>
  );
}