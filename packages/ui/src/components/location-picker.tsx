'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { cn } from '../lib/utils';
import { Button } from './button';
import { Input } from './input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { MapPin, Search, Star, Clock, Globe } from 'lucide-react';

export interface LocationData {
  id?: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  country: string;
  countryCode?: string;
  placeId?: string;
  placeType?: string;
  category?: string;
  subcategory?: string;
  averageRating?: number;
  timezone?: string;
  photos?: string[];
}

export interface LocationPickerProps {
  value?: LocationData;
  onChange: (location: LocationData | null) => void;
  placeholder?: string;
  className?: string;
  showMap?: boolean;
  showDetails?: boolean;
  required?: boolean;
  disabled?: boolean;
}

interface SearchResult extends LocationData {
  formatted_address: string;
  place_id: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export function LocationPicker({
  value,
  onChange,
  placeholder = "Search for a location...",
  className,
  showMap = false,
  showDetails = true,
  required = false,
  disabled = false,
}: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState(value?.name || '');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(value || null);

  // Simulated search function (in real implementation, this would call Google Places API)
  const searchLocations = useCallback(async (query: string): Promise<SearchResult[]> => {
    if (!query.trim()) return [];

    setIsSearching(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Mock search results (in real implementation, this would be from Google Places API)
    const mockResults: SearchResult[] = [
      {
        name: 'Eiffel Tower',
        description: 'Iconic iron lattice tower in Paris',
        formatted_address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France',
        place_id: 'ChIJLU7jZClu5kcR4PcOOO6p3I0',
        latitude: 48.8584,
        longitude: 2.2945,
        city: 'Paris',
        country: 'France',
        countryCode: 'FR',
        placeType: 'tourist_attraction',
        category: 'landmarks',
        averageRating: 4.6,
        timezone: 'Europe/Paris',
        geometry: {
          location: {
            lat: 48.8584,
            lng: 2.2945
          }
        },
        photos: ['/images/eiffel-tower.jpg']
      },
      {
        name: 'Times Square',
        description: 'Major commercial intersection and tourist destination',
        formatted_address: 'Times Square, New York, NY 10036, USA',
        place_id: 'ChIJmQJIxlVYwokRLgeuocVOGVU',
        latitude: 40.7580,
        longitude: -73.9855,
        city: 'New York',
        state: 'New York',
        country: 'United States',
        countryCode: 'US',
        placeType: 'tourist_attraction',
        category: 'entertainment',
        averageRating: 4.3,
        timezone: 'America/New_York',
        geometry: {
          location: {
            lat: 40.7580,
            lng: -73.9855
          }
        },
        photos: ['/images/times-square.jpg']
      }
    ].filter(location => 
      location.name.toLowerCase().includes(query.toLowerCase()) ||
      location.formatted_address.toLowerCase().includes(query.toLowerCase())
    );

    setIsSearching(false);
    return mockResults;
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    const results = await searchLocations(query);
    setSearchResults(results);
    setShowResults(true);
  }, [searchLocations]);

  const handleLocationSelect = useCallback((location: SearchResult) => {
    const locationData: LocationData = {
      name: location.name,
      description: location.description,
      latitude: location.geometry.location.lat,
      longitude: location.geometry.location.lng,
      address: location.formatted_address,
      city: location.city,
      state: location.state,
      country: location.country,
      countryCode: location.countryCode,
      placeId: location.place_id,
      placeType: location.placeType,
      category: location.category,
      subcategory: location.subcategory,
      averageRating: location.averageRating,
      timezone: location.timezone,
      photos: location.photos,
    };

    setSelectedLocation(locationData);
    setSearchQuery(location.name);
    setShowResults(false);
    onChange(locationData);
  }, [onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length > 2) {
      handleSearch(query);
    } else {
      setShowResults(false);
      setSearchResults([]);
    }
  };

  const clearSelection = () => {
    setSelectedLocation(null);
    setSearchQuery('');
    onChange(null);
  };

  useEffect(() => {
    if (value && value.name !== searchQuery) {
      setSearchQuery(value.name);
      setSelectedLocation(value);
    }
  }, [value, searchQuery]);

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={handleInputChange}
            disabled={disabled}
            required={required}
            className="pl-10 pr-10"
          />
          {selectedLocation && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearSelection}
              disabled={disabled}
              className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0 hover:bg-destructive/10"
            >
              ×
            </Button>
          )}
        </div>

        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-r-transparent" />
          </div>
        )}
      </div>

      {/* Search Results */}
      {showResults && searchResults.length > 0 && (
        <Card className="absolute top-full z-50 mt-1 w-full border shadow-lg">
          <CardContent className="p-0">
            <div className="max-h-60 overflow-y-auto">
              {searchResults.map((location) => (
                <button
                  key={location.place_id}
                  type="button"
                  onClick={() => handleLocationSelect(location)}
                  className="w-full p-3 text-left hover:bg-muted/50 focus:bg-muted focus:outline-none first:rounded-t-lg last:rounded-b-lg"
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{location.name}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {location.formatted_address}
                      </div>
                      {location.averageRating && (
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-medium">{location.averageRating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Location Details */}
      {selectedLocation && showDetails && (
        <Card className="mt-3">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {selectedLocation.name}
            </CardTitle>
            {selectedLocation.description && (
              <CardDescription className="text-sm">
                {selectedLocation.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {selectedLocation.address && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-3 w-3 mt-1 text-muted-foreground flex-shrink-0" />
                  <span className="text-muted-foreground">{selectedLocation.address}</span>
                </div>
              )}
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {selectedLocation.averageRating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{selectedLocation.averageRating}</span>
                  </div>
                )}
                
                {selectedLocation.timezone && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{selectedLocation.timezone}</span>
                  </div>
                )}
                
                {selectedLocation.countryCode && (
                  <div className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    <span>{selectedLocation.countryCode}</span>
                  </div>
                )}
              </div>

              {selectedLocation.category && (
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    {selectedLocation.category}
                  </span>
                  {selectedLocation.subcategory && (
                    <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs font-medium">
                      {selectedLocation.subcategory}
                    </span>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Map Integration Placeholder */}
      {selectedLocation && showMap && (
        <Card className="mt-3">
          <CardContent className="p-0">
            <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Map view would be shown here</p>
                <p className="text-xs">
                  {selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}