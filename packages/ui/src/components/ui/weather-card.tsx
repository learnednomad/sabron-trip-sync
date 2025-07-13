import * as React from 'react';
import { useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { useTranslation } from 'react-i18next';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning,
  Wind,
  Droplets,
  Eye,
  Thermometer,
  MapPin,
  RefreshCw,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './button';

const weatherCardVariants = cva(
  'relative w-full bg-background border rounded-lg overflow-hidden',
  {
    variants: {
      preset: {
        default: 'border-border',
        travel: 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200',
        minimal: 'border-0 shadow-none bg-transparent',
        compact: 'border-border',
      },
      size: {
        small: 'p-3',
        default: 'p-4',
        large: 'p-6',
      },
      layout: {
        horizontal: 'flex-row',
        vertical: 'flex-col',
        grid: 'grid grid-cols-2 gap-4',
      },
    },
    defaultVariants: {
      preset: 'travel',
      size: 'default',
      layout: 'vertical',
    },
  }
);

export interface WeatherCondition {
  id: string;
  main: string; // Clear, Clouds, Rain, Snow, etc.
  description: string; // "clear sky", "light rain", etc.
  icon: string;
}

export interface WeatherData {
  location: {
    name: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    pressure: number;
    visibility: number;
    windSpeed: number;
    windDirection: number;
    uvIndex: number;
    condition: WeatherCondition;
  };
  forecast?: Array<{
    date: Date;
    high: number;
    low: number;
    condition: WeatherCondition;
    precipitation: number;
  }>;
  alerts?: Array<{
    id: string;
    title: string;
    description: string;
    severity: 'minor' | 'moderate' | 'severe' | 'extreme';
    startTime: Date;
    endTime: Date;
  }>;
  updatedAt: Date;
}

export interface WeatherCardProps
  extends VariantProps<typeof weatherCardVariants> {
  // Data
  weather?: WeatherData;
  
  // Configuration
  showForecast?: boolean;
  showDetails?: boolean;
  showAlerts?: boolean;
  temperatureUnit?: 'celsius' | 'fahrenheit';
  windSpeedUnit?: 'kmh' | 'mph' | 'ms';
  
  // Events
  onRefresh?: () => void;
  onLocationClick?: (location: WeatherData['location']) => void;
  
  // Labels
  locationTx?: string;
  lastUpdatedTx?: string;
  
  // Styling
  className?: string;
  
  // States
  loading?: boolean;
  error?: string;
  
  // Travel features
  showTravelAdvice?: boolean;
  showPackingTips?: boolean;
  
  // Custom renderers
  renderWeatherIcon?: (condition: WeatherCondition) => React.ReactNode;
  renderForecastItem?: (forecast: NonNullable<WeatherData['forecast']>[0]) => React.ReactNode;
}

export const WeatherCard = React.forwardRef<HTMLDivElement, WeatherCardProps>(
  ({
    preset,
    size,
    layout,
    weather,
    showForecast = true,
    showDetails = true,
    showAlerts = true,
    temperatureUnit = 'celsius',
    windSpeedUnit = 'kmh',
    onRefresh,
    onLocationClick,
    lastUpdatedTx = 'weather.lastUpdated',
    className,
    loading = false,
    error,
    showTravelAdvice = true,
    renderWeatherIcon,
    renderForecastItem,
  }, ref) => {
    const { t } = useTranslation();
    const [refreshing, setRefreshing] = useState(false);
    
    const getWeatherIcon = (condition: WeatherCondition) => {
      if (renderWeatherIcon) return renderWeatherIcon(condition);
      
      const iconMap = {
        clear: <Sun className="w-6 h-6 text-yellow-500" />,
        clouds: <Cloud className="w-6 h-6 text-gray-500" />,
        rain: <CloudRain className="w-6 h-6 text-blue-500" />,
        snow: <CloudSnow className="w-6 h-6 text-blue-200" />,
        thunderstorm: <CloudLightning className="w-6 h-6 text-purple-500" />,
        drizzle: <CloudRain className="w-6 h-6 text-blue-400" />,
        mist: <Cloud className="w-6 h-6 text-gray-400" />,
        fog: <Cloud className="w-6 h-6 text-gray-400" />,
      };
      
      const key = condition.main.toLowerCase();
      return typeof key === 'string' && key in iconMap 
        ? iconMap[key as keyof typeof iconMap] 
        : <Sun className="w-6 h-6 text-gray-500" />;
    };
    
    const formatTemperature = (temp: number) => {
      if (temperatureUnit === 'fahrenheit') {
        return `${Math.round((temp * 9/5) + 32)}°F`;
      }
      return `${Math.round(temp)}°C`;
    };
    
    const formatWindSpeed = (speed: number) => {
      switch (windSpeedUnit) {
        case 'mph':
          return `${Math.round(speed * 2.237)} mph`;
        case 'ms':
          return `${Math.round(speed)} m/s`;
        case 'kmh':
        default:
          return `${Math.round(speed * 3.6)} km/h`;
      }
    };
    
    const getWindDirection = (degrees: number) => {
      const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
      return directions[Math.round(degrees / 45) % 8];
    };
    
    const getTravelAdvice = (condition: WeatherCondition, temperature: number) => {
      if (!showTravelAdvice) return null;
      
      const temp = temperatureUnit === 'fahrenheit' ? (temperature * 9/5) + 32 : temperature;
      const main = condition.main.toLowerCase();
      
      let advice = '';
      let color = 'text-green-600';
      
      if (main.includes('rain') || main.includes('storm')) {
        advice = 'Pack an umbrella and waterproof clothing';
        color = 'text-blue-600';
      } else if (main.includes('snow')) {
        advice = 'Dress warmly and wear non-slip shoes';
        color = 'text-blue-800';
      } else if (temp > (temperatureUnit === 'fahrenheit' ? 86 : 30)) {
        advice = 'Stay hydrated and wear sun protection';
        color = 'text-orange-600';
      } else if (temp < (temperatureUnit === 'fahrenheit' ? 32 : 0)) {
        advice = 'Dress in layers and protect exposed skin';
        color = 'text-blue-800';
      } else {
        advice = 'Perfect weather for outdoor activities';
        color = 'text-green-600';
      }
      
      return (
        <div className={cn('text-xs mt-2', color)}>
          {advice}
        </div>
      );
    };
    
    const handleRefresh = async () => {
      if (!onRefresh || refreshing) return;
      
      setRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
      }
    };
    
    if (loading) {
      return (
        <div className={cn(weatherCardVariants({ preset, size, layout }), className)} ref={ref}>
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-muted-foreground mt-2">Loading weather...</p>
            </div>
          </div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className={cn(weatherCardVariants({ preset, size, layout }), className)} ref={ref}>
          <div className="text-center p-4">
            <Cloud className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">{error}</p>
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="mt-2"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Try Again
              </Button>
            )}
          </div>
        </div>
      );
    }
    
    if (!weather) {
      return (
        <div className={cn(weatherCardVariants({ preset, size, layout }), className)} ref={ref}>
          <div className="text-center p-4">
            <Cloud className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No weather data available</p>
          </div>
        </div>
      );
    }

    return (
      <div className={cn(weatherCardVariants({ preset, size, layout }), className)} ref={ref}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div 
            className="flex items-center space-x-2 cursor-pointer hover:opacity-75"
            onClick={() => onLocationClick?.(weather.location)}
          >
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <div>
              <h3 className="font-semibold text-foreground">{weather.location.name}</h3>
              <p className="text-xs text-muted-foreground">{weather.location.country}</p>
            </div>
          </div>
          
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={cn('w-4 h-4', refreshing && 'animate-spin')} />
            </Button>
          )}
        </div>
        
        {/* Current weather */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            {getWeatherIcon(weather.current.condition)}
            <div>
              <div className="text-2xl font-bold text-foreground">
                {formatTemperature(weather.current.temperature)}
              </div>
              <div className="text-sm text-muted-foreground">
                Feels like {formatTemperature(weather.current.feelsLike)}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm font-medium text-foreground capitalize">
              {weather.current.condition.description}
            </div>
            {getTravelAdvice(weather.current.condition, weather.current.temperature)}
          </div>
        </div>
        
        {/* Alerts */}
        {showAlerts && weather.alerts && weather.alerts.length > 0 && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-sm font-medium text-yellow-800 mb-1">Weather Alert</div>
            <div className="text-xs text-yellow-700">
              {weather.alerts?.[0]?.title}
            </div>
          </div>
        )}
        
        {/* Details */}
        {showDetails && (
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div className="flex items-center space-x-2">
              <Wind className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Wind:</span>
              <span className="text-foreground">
                {formatWindSpeed(weather.current.windSpeed)} {getWindDirection(weather.current.windDirection)}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Droplets className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Humidity:</span>
              <span className="text-foreground">{weather.current.humidity}%</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Visibility:</span>
              <span className="text-foreground">{weather.current.visibility} km</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Thermometer className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">UV Index:</span>
              <span className="text-foreground">{weather.current.uvIndex}</span>
            </div>
          </div>
        )}
        
        {/* Forecast */}
        {showForecast && weather.forecast && weather.forecast.length > 0 && (
          <div>
            <div className="text-sm font-medium text-foreground mb-2">5-Day Forecast</div>
            <div className="space-y-2">
              {weather.forecast.slice(0, 5).map((day, index) => {
                if (renderForecastItem) return renderForecastItem(day);
                
                return (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div className="flex items-center space-x-3">
                      {getWeatherIcon(day.condition)}
                      <div>
                        <div className="text-xs text-muted-foreground">
                          {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {day.condition.description}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-3 h-3 text-red-500" />
                        <span className="font-medium">{formatTemperature(day.high)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingDown className="w-3 h-3 text-blue-500" />
                        <span className="text-muted-foreground">{formatTemperature(day.low)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Last updated */}
        <div className="text-xs text-muted-foreground mt-4 text-center">
          {t(lastUpdatedTx)}: {weather.updatedAt.toLocaleTimeString()}
        </div>
      </div>
    );
  }
);

WeatherCard.displayName = 'WeatherCard';

export { weatherCardVariants };