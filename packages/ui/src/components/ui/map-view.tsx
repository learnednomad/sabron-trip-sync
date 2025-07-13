import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { useTranslation } from 'react-i18next';
import { 
  Map, 
  MapPin, 
  Navigation, 
  Layers, 
  Search, 
  Plus, 
  Minus,
  Route,
  Camera,
  Filter
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './button';

const mapViewVariants = cva(
  'relative w-full bg-background border rounded-lg overflow-hidden',
  {
    variants: {
      preset: {
        default: 'border-border',
        travel: 'border-blue-200 shadow-lg',
        minimal: 'border-0 shadow-none',
        fullscreen: 'fixed inset-0 z-50 rounded-none border-0',
      },
      size: {
        small: 'h-48',
        default: 'h-64',
        large: 'h-96',
        fullscreen: 'h-screen',
      },
    },
    defaultVariants: {
      preset: 'travel',
      size: 'default',
    },
  }
);

export interface MapMarker {
  id: string;
  position: {
    lat: number;
    lng: number;
  };
  title: string;
  description?: string;
  type: 'hotel' | 'restaurant' | 'attraction' | 'airport' | 'landmark' | 'custom';
  icon?: React.ReactNode;
  color?: string;
  onClick?: () => void;
}

export interface MapRoute {
  id: string;
  points: Array<{ lat: number; lng: number }>;
  color?: string;
  strokeWidth?: number;
  type: 'driving' | 'walking' | 'transit' | 'flight';
}

export interface MapViewProps
  extends VariantProps<typeof mapViewVariants> {
  // Map configuration
  center?: { lat: number; lng: number };
  zoom?: number;
  mapType?: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
  
  // Data
  markers?: MapMarker[];
  routes?: MapRoute[];
  
  // Events
  onMapClick?: (position: { lat: number; lng: number }) => void;
  onMarkerClick?: (marker: MapMarker) => void;
  onZoomChange?: (zoom: number) => void;
  onCenterChange?: (center: { lat: number; lng: number }) => void;
  
  // Controls
  showControls?: boolean;
  showSearch?: boolean;
  showLayers?: boolean;
  showNavigation?: boolean;
  allowFullscreen?: boolean;
  
  // Travel features
  showNearbyPlaces?: boolean;
  nearbyPlaceTypes?: string[];
  showTraffic?: boolean;
  showPublicTransit?: boolean;
  
  // Labels
  searchPlaceholderTx?: string;
  
  // Styling
  className?: string;
  controlsClassName?: string;
  
  // States
  loading?: boolean;
  disabled?: boolean;
  
  // Custom renderers
  renderMarker?: (marker: MapMarker) => React.ReactNode;
  renderInfoWindowContent?: (marker: MapMarker) => React.ReactNode;
}

export const MapView = React.forwardRef<HTMLDivElement, MapViewProps>(
  ({
    preset,
    size,
    center = { lat: 37.7749, lng: -122.4194 }, // San Francisco default
    zoom = 10,
    markers = [],
    routes = [],
    onMapClick,
    onMarkerClick,
    onZoomChange,
    showControls = true,
    showSearch = true,
    showLayers = true,
    showNavigation = true,
    allowFullscreen = true,
    showNearbyPlaces = false,
    showTraffic = false,
    showPublicTransit = false,
    searchPlaceholderTx = 'map.searchPlaces',
    className,
    controlsClassName,
    loading = false,
    disabled = false,
    renderMarker,
    renderInfoWindowContent,
  }, ref) => {
    const { t } = useTranslation();
    const [currentZoom, setCurrentZoom] = useState(zoom);
    const [currentCenter, setCurrentCenter] = useState(center);
    const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [layersOpen, setLayersOpen] = useState(false);
    const mapRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
      setCurrentCenter(center);
    }, [center]);
    
    useEffect(() => {
      setCurrentZoom(zoom);
    }, [zoom]);
    
    const handleZoomIn = () => {
      const newZoom = Math.min(currentZoom + 1, 20);
      setCurrentZoom(newZoom);
      onZoomChange?.(newZoom);
    };
    
    const handleZoomOut = () => {
      const newZoom = Math.max(currentZoom - 1, 1);
      setCurrentZoom(newZoom);
      onZoomChange?.(newZoom);
    };
    
    const getMarkerIcon = (type: MapMarker['type']) => {
      const iconMap = {
        hotel: <MapPin className="w-4 h-4 text-blue-600" />,
        restaurant: <MapPin className="w-4 h-4 text-red-600" />,
        attraction: <MapPin className="w-4 h-4 text-green-600" />,
        airport: <MapPin className="w-4 h-4 text-purple-600" />,
        landmark: <MapPin className="w-4 h-4 text-yellow-600" />,
        custom: <MapPin className="w-4 h-4 text-gray-600" />,
      };
      
      return typeof type === 'string' && type in iconMap 
        ? iconMap[type as keyof typeof iconMap] 
        : <MapPin className="w-4 h-4 text-gray-600" />;
    };
    
    const getRouteColor = (type: MapRoute['type']) => {
      const colorMap = {
        driving: '#3B82F6', // blue
        walking: '#10B981', // green
        transit: '#8B5CF6', // purple
        flight: '#F59E0B', // yellow
      };
      
      return typeof type === 'string' && type in colorMap 
        ? colorMap[type as keyof typeof colorMap] 
        : '#6B7280';
    };
    
    const renderMapControls = () => {
      if (!showControls) return null;
      
      return (
        <div className={cn('absolute top-4 right-4 space-y-2', controlsClassName)}>
          {/* Zoom controls */}
          <div className="bg-background border rounded-lg shadow-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              disabled={disabled || currentZoom >= 20}
              className="rounded-b-none border-b"
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              disabled={disabled || currentZoom <= 1}
              className="rounded-t-none"
            >
              <Minus className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Navigation control */}
          {showNavigation && (
            <Button
              variant="outline"
              size="sm"
              className="bg-background"
              disabled={disabled}
            >
              <Navigation className="w-4 h-4" />
            </Button>
          )}
          
          {/* Layers control */}
          {showLayers && (
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="bg-background"
                onClick={() => setLayersOpen(!layersOpen)}
                disabled={disabled}
              >
                <Layers className="w-4 h-4" />
              </Button>
              {layersOpen && (
                <div className="absolute top-full right-0 mt-1 bg-background border rounded-lg shadow-lg p-2 w-48 z-10">
                  <div className="space-y-2 text-sm">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" checked={showTraffic} className="rounded" />
                      <span>Traffic</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" checked={showPublicTransit} className="rounded" />
                      <span>Public Transit</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" checked={showNearbyPlaces} className="rounded" />
                      <span>Nearby Places</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Fullscreen control */}
          {allowFullscreen && (
            <Button
              variant="outline"
              size="sm"
              className="bg-background"
              onClick={() => setIsFullscreen(!isFullscreen)}
              disabled={disabled}
            >
              <Camera className="w-4 h-4" />
            </Button>
          )}
        </div>
      );
    };
    
    const renderSearchBar = () => {
      if (!showSearch) return null;
      
      return (
        <div className="absolute top-4 left-4 right-20">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t(searchPlaceholderTx)}
              className="w-full pl-10 pr-4 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={disabled}
            />
          </div>
        </div>
      );
    };
    
    const renderMarkers = () => {
      return markers.map((marker) => (
        <div
          key={marker.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
          style={{
            left: `${50 + (marker.position.lng - currentCenter.lng) * 100}%`,
            top: `${50 - (marker.position.lat - currentCenter.lat) * 100}%`,
          }}
          onClick={() => {
            setSelectedMarker(marker);
            onMarkerClick?.(marker);
          }}
        >
          {renderMarker ? renderMarker(marker) : (
            <div
              className="bg-background border-2 border-white rounded-full p-1 shadow-lg hover:scale-110 transition-transform"
              style={{ borderColor: marker.color || '#fff' }}
            >
              {marker.icon || getMarkerIcon(marker.type)}
            </div>
          )}
        </div>
      ));
    };
    
    const renderRoutes = () => {
      return routes.map((route) => (
        <svg
          key={route.id}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 5 }}
        >
          <path
            d={route.points.map((point, index) => 
              `${index === 0 ? 'M' : 'L'} ${50 + (point.lng - currentCenter.lng) * 100}% ${50 - (point.lat - currentCenter.lat) * 100}%`
            ).join(' ')}
            stroke={route.color || getRouteColor(route.type)}
            strokeWidth={route.strokeWidth || 3}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ));
    };
    
    const renderInfoWindow = () => {
      if (!selectedMarker) return null;
      
      return (
        <div className="absolute bottom-4 left-4 right-4 bg-background border rounded-lg shadow-lg p-4 z-20">
          {renderInfoWindowContent ? renderInfoWindowContent(selectedMarker) : (
            <div>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{selectedMarker.title}</h3>
                  {selectedMarker.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedMarker.description}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedMarker(null)}
                >
                  ×
                </Button>
              </div>
              <div className="flex items-center space-x-2 mt-3">
                <Button size="sm" variant="outline">
                  <Route className="w-4 h-4 mr-1" />
                  Directions
                </Button>
                <Button size="sm" variant="outline">
                  <Filter className="w-4 h-4 mr-1" />
                  Details
                </Button>
              </div>
            </div>
          )}
        </div>
      );
    };

    return (
      <div
        ref={ref}
        className={cn(
          mapViewVariants({ preset: isFullscreen ? 'fullscreen' : preset, size: isFullscreen ? 'fullscreen' : size }),
          className
        )}
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-muted-foreground mt-2">Loading map...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Map placeholder - In real implementation, this would be replaced with actual map */}
            <div
              ref={mapRef}
              className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 relative overflow-hidden"
              onClick={(e) => {
                if (disabled) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const lat = currentCenter.lat + (0.5 - y / rect.height) * 0.1;
                const lng = currentCenter.lng + (x / rect.width - 0.5) * 0.1;
                onMapClick?.({ lat, lng });
              }}
            >
              {/* Grid pattern to simulate map */}
              <div className="absolute inset-0 opacity-20">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={`h-${i}`}
                    className="absolute w-full border-t border-gray-400"
                    style={{ top: `${i * 10}%` }}
                  />
                ))}
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={`v-${i}`}
                    className="absolute h-full border-l border-gray-400"
                    style={{ left: `${i * 10}%` }}
                  />
                ))}
              </div>
              
              {/* Center indicator */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Map className="w-6 h-6 text-gray-400" />
              </div>
              
              {/* Routes */}
              {renderRoutes()}
              
              {/* Markers */}
              {renderMarkers()}
            </div>
            
            {/* Search bar */}
            {renderSearchBar()}
            
            {/* Map controls */}
            {renderMapControls()}
            
            {/* Info window */}
            {renderInfoWindow()}
          </>
        )}
      </div>
    );
  }
);

MapView.displayName = 'MapView';

export { mapViewVariants };