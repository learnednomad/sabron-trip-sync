import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, Plane, Star, TrendingUp, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

const destinationSearchVariants = cva(
  'relative w-full',
  {
    variants: {
      preset: {
        default: 'border rounded-lg bg-background',
        travel: 'border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl',
        minimal: 'border-0 bg-transparent',
        elevated: 'border shadow-lg bg-background rounded-xl',
      },
      size: {
        small: 'p-2',
        default: 'p-4',
        large: 'p-6',
      },
    },
    defaultVariants: {
      preset: 'travel',
      size: 'default',
    },
  }
);

export interface Destination {
  id: string;
  name: string;
  code?: string; // Airport code for flights
  country: string;
  city: string;
  type: 'city' | 'airport' | 'landmark' | 'region';
  popularity?: number;
  imageUrl?: string;
  description?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface DestinationSearchProps
  extends VariantProps<typeof destinationSearchVariants> {
  // Search props
  value?: string;
  onDestinationSelect?: (destination: Destination) => void;
  onSearchChange?: (query: string) => void;
  
  // Data
  destinations?: Destination[];
  popularDestinations?: Destination[];
  recentSearches?: Destination[];
  
  // Labels
  placeholderTx?: string;
  noResultsTx?: string;
  
  // Search configuration
  searchType?: 'flights' | 'hotels' | 'all';
  enableGeolocation?: boolean;
  showPopular?: boolean;
  showRecent?: boolean;
  maxResults?: number;
  
  // Styling
  className?: string;
  inputClassName?: string;
  dropdownClassName?: string;
  
  // States
  disabled?: boolean;
  loading?: boolean;
  
  // Custom components
  renderDestination?: (destination: Destination) => React.ReactNode;
  renderEmpty?: () => React.ReactNode;
}

export const DestinationSearch = React.forwardRef<HTMLDivElement, DestinationSearchProps>(
  ({
    preset,
    size,
    value = '',
    onDestinationSelect,
    onSearchChange,
    destinations = [],
    popularDestinations = [],
    recentSearches = [],
    placeholderTx = 'search.destination.placeholder',
    noResultsTx = 'search.destination.noResults',
    showPopular = true,
    showRecent = true,
    maxResults = 10,
    className,
    inputClassName,
    dropdownClassName,
    disabled = false,
    loading = false,
    renderDestination,
    renderEmpty,
  }, ref) => {
    const { t } = useTranslation();
    const [query, setQuery] = useState(value);
    const [isOpen, setIsOpen] = useState(false);
    const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    // Filter destinations based on query
    useEffect(() => {
      if (!query.trim()) {
        setFilteredDestinations([]);
        return;
      }
      
      const filtered = destinations
        .filter(dest => 
          dest.name.toLowerCase().includes(query.toLowerCase()) ||
          dest.city.toLowerCase().includes(query.toLowerCase()) ||
          dest.country.toLowerCase().includes(query.toLowerCase()) ||
          (dest.code && dest.code.toLowerCase().includes(query.toLowerCase()))
        )
        .slice(0, maxResults);
      
      setFilteredDestinations(filtered);
    }, [query, destinations, maxResults]);
    
    // Handle outside clicks
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current &&
          !inputRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      }
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newQuery = e.target.value;
      setQuery(newQuery);
      onSearchChange?.(newQuery);
      setIsOpen(true);
    };
    
    const handleDestinationClick = (destination: Destination) => {
      setQuery(destination.name);
      setIsOpen(false);
      onDestinationSelect?.(destination);
    };
    
    const getDestinationIcon = (type: Destination['type']) => {
      switch (type) {
        case 'airport':
          return <Plane className="w-4 h-4 text-blue-500" />;
        case 'city':
          return <MapPin className="w-4 h-4 text-green-500" />;
        case 'landmark':
          return <Star className="w-4 h-4 text-yellow-500" />;
        case 'region':
          return <MapPin className="w-4 h-4 text-purple-500" />;
        default:
          return <MapPin className="w-4 h-4 text-gray-500" />;
      }
    };
    
    const renderDestinationItem = (destination: Destination) => {
      if (renderDestination) {
        return renderDestination(destination);
      }
      
      return (
        <button
          key={destination.id}
          className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 text-left transition-colors"
          onClick={() => handleDestinationClick(destination)}
        >
          {getDestinationIcon(destination.type)}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-foreground">{destination.name}</span>
              {destination.code && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {destination.code}
                </span>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {destination.city}, {destination.country}
            </div>
            {destination.description && (
              <div className="text-xs text-muted-foreground mt-1">
                {destination.description}
              </div>
            )}
          </div>
          {destination.popularity && destination.popularity > 0.8 && (
            <TrendingUp className="w-4 h-4 text-orange-500" />
          )}
        </button>
      );
    };
    
    const renderSuggestions = () => {
      if (query.trim()) {
        if (loading) {
          return (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          );
        }
        
        if (filteredDestinations.length === 0) {
          return renderEmpty ? renderEmpty() : (
            <div className="p-4 text-center text-muted-foreground">
              {t(noResultsTx)}
            </div>
          );
        }
        
        return (
          <div className="max-h-64 overflow-y-auto">
            {filteredDestinations.map(renderDestinationItem)}
          </div>
        );
      }
      
      // Show suggestions when no query
      return (
        <div className="space-y-4">
          {showRecent && recentSearches.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Recent Searches</span>
              </div>
              <div className="max-h-32 overflow-y-auto">
                {recentSearches.slice(0, 3).map(renderDestinationItem)}
              </div>
            </div>
          )}
          
          {showPopular && popularDestinations.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                <span>Popular Destinations</span>
              </div>
              <div className="max-h-40 overflow-y-auto">
                {popularDestinations.slice(0, 5).map(renderDestinationItem)}
              </div>
            </div>
          )}
        </div>
      );
    };

    return (
      <div
        ref={ref}
        className={cn(destinationSearchVariants({ preset, size }), className)}
      >
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onFocus={() => setIsOpen(true)}
              placeholder={t(placeholderTx)}
              disabled={disabled}
              className={cn(
                'w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                disabled && 'opacity-50 cursor-not-allowed',
                inputClassName
              )}
            />
          </div>
          
          {isOpen && (
            <div
              ref={dropdownRef}
              className={cn(
                'absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50',
                dropdownClassName
              )}
            >
              {renderSuggestions()}
            </div>
          )}
        </div>
      </div>
    );
  }
);

DestinationSearch.displayName = 'DestinationSearch';

export { destinationSearchVariants };