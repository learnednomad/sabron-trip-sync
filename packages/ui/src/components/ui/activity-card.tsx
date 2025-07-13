import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { useTranslation } from 'react-i18next';
import { 
  Clock, 
  MapPin, 
  DollarSign, 
  Users, 
  Star,
  Camera,
  Utensils,
  Car,
  Plane,
  Building,
  Mountain
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Badge } from './badge';

const activityCardVariants = cva(
  'group relative rounded-lg border bg-card p-4 transition-all duration-200',
  {
    variants: {
      preset: {
        default: 'hover:shadow-md border-border',
        travel: 'border-blue-200 hover:border-blue-300 bg-gradient-to-br from-white to-blue-50',
        timeline: 'border-l-4 border-l-blue-500 pl-6 border-border',
        compact: 'p-3 border-border hover:bg-accent',
      },
      status: {
        planned: 'border-border',
        confirmed: 'border-green-200 bg-green-50/50',
        completed: 'border-gray-200 bg-gray-50/50',
        cancelled: 'border-red-200 bg-red-50/50',
      },
      size: {
        small: 'p-2',
        default: 'p-4',
        large: 'p-6',
      },
      interactive: {
        true: 'cursor-pointer hover:shadow-md',
        false: 'cursor-default',
      },
    },
    defaultVariants: {
      preset: 'default',
      status: 'planned',
      size: 'default',
      interactive: true,
    },
  }
);

const categoryIcons = {
  sightseeing: Camera,
  food: Utensils,
  transport: Car,
  flight: Plane,
  accommodation: Building,
  adventure: Mountain,
  default: MapPin,
} as const;

export interface ActivityCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onPress'>,
    VariantProps<typeof activityCardVariants> {
  // Activity data
  title: string;
  titleTx?: string;
  titleTxOptions?: Record<string, any>;
  
  description?: string;
  descriptionTx?: string;
  descriptionTxOptions?: Record<string, any>;
  
  // Time information
  time?: string;
  startTime?: Date;
  endTime?: Date;
  duration?: string;
  durationTx?: string;
  durationTxOptions?: Record<string, any>;
  
  // Location
  location?: string;
  locationTx?: string;
  locationTxOptions?: Record<string, any>;
  
  // Category
  category?: keyof typeof categoryIcons;
  categoryLabel?: string;
  categoryLabelTx?: string;
  categoryLabelTxOptions?: Record<string, any>;
  
  // Cost
  cost?: number;
  currency?: string;
  
  // Rating
  rating?: number;
  maxRating?: number;
  
  // Participants
  participants?: number;
  maxParticipants?: number;
  
  // Actions
  onPress?: () => void;
  onEdit?: () => void;
  onCancel?: () => void;
  
  // Styling
  titleStyle?: string;
  descriptionStyle?: string;
  
  // Show/hide elements
  showTime?: boolean;
  showLocation?: boolean;
  showCost?: boolean;
  showRating?: boolean;
  showParticipants?: boolean;
  showCategory?: boolean;
}

const ActivityCard = React.forwardRef<HTMLDivElement, ActivityCardProps>(
  ({
    className,
    preset,
    status,
    size,
    interactive,
    title,
    titleTx,
    titleTxOptions,
    description,
    descriptionTx,
    descriptionTxOptions,
    time,
    startTime,
    endTime,
    duration,
    durationTx,
    durationTxOptions,
    location,
    locationTx,
    locationTxOptions,
    category = 'default',
    categoryLabel,
    categoryLabelTx,
    categoryLabelTxOptions,
    cost,
    currency = 'USD',
    rating,
    maxRating = 5,
    participants,
    maxParticipants,
    onPress,
    onEdit,
    onCancel,
    titleStyle,
    descriptionStyle,
    showTime = true,
    showLocation = true,
    showCost = false,
    showRating = false,
    showParticipants = false,
    showCategory = true,
    ...props
  }, ref) => {
    const { t } = useTranslation();
    
    const titleText = titleTx ? t(titleTx, titleTxOptions) : title;
    const descriptionText = descriptionTx ? t(descriptionTx, descriptionTxOptions) : description;
    const locationText = locationTx ? t(locationTx, locationTxOptions) : location;
    const durationText = durationTx ? t(durationTx, durationTxOptions) : duration;
    const categoryText = categoryLabelTx ? t(categoryLabelTx, categoryLabelTxOptions) : categoryLabel;
    
    const formatTime = () => {
      if (time) return time;
      
      if (startTime && endTime) {
        return `${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
      
      if (startTime) {
        return startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      
      return null;
    };
    
    const handleClick = () => {
      if (interactive && onPress) {
        onPress();
      }
    };
    
    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (interactive && onPress && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        onPress();
      }
    };
    
    const renderCategoryIcon = () => {
      const IconComponent = categoryIcons[category];
      return <IconComponent className="w-5 h-5" />;
    };
    
    const renderRating = () => {
      if (!showRating || !rating) return null;
      
      return (
        <div className="flex items-center space-x-1">
          {Array.from({ length: maxRating }, (_, i) => (
            <Star
              key={i}
              className={cn(
                'w-4 h-4',
                i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              )}
            />
          ))}
          <span className="text-sm text-muted-foreground ml-1">
            {rating}/{maxRating}
          </span>
        </div>
      );
    };

    return (
      <div
        ref={ref}
        className={cn(activityCardVariants({ preset, status, size, interactive, className }))}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role={interactive && onPress ? 'button' : undefined}
        tabIndex={interactive && onPress ? 0 : undefined}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            {/* Header with title and category */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                {showCategory && (
                  <div className="text-blue-500">
                    {renderCategoryIcon()}
                  </div>
                )}
                <h3 className={cn(
                  'font-semibold text-foreground',
                  size === 'small' && 'text-sm',
                  size === 'large' && 'text-lg',
                  titleStyle
                )}>
                  {titleText}
                </h3>
              </div>
              
              <div className="flex items-center space-x-2">
                {showCategory && categoryText && (
                  <Badge variant="outline" className="text-xs">
                    {categoryText}
                  </Badge>
                )}
                
                <Badge 
                  variant={
                    status === 'confirmed' ? 'default' :
                    status === 'completed' ? 'secondary' :
                    status === 'cancelled' ? 'destructive' :
                    'outline'
                  }
                  className="text-xs"
                >
                  {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
                </Badge>
              </div>
            </div>
            
            {/* Description */}
            {descriptionText && (
              <p className={cn(
                'text-muted-foreground',
                size === 'small' && 'text-xs',
                size === 'default' && 'text-sm',
                descriptionStyle
              )}>
                {descriptionText}
              </p>
            )}
            
            {/* Details row */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-4">
                {showTime && formatTime() && (
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime()}</span>
                    {durationText && <span>({durationText})</span>}
                  </div>
                )}
                
                {showLocation && locationText && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate max-w-[150px]">{locationText}</span>
                  </div>
                )}
                
                {showParticipants && participants && (
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>
                      {participants}
                      {maxParticipants && `/${maxParticipants}`}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                {showCost && cost && (
                  <div className="flex items-center space-x-1 font-medium">
                    <DollarSign className="w-4 h-4" />
                    <span>{cost.toLocaleString()} {currency}</span>
                  </div>
                )}
                
                {renderRating()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ActivityCard.displayName = 'ActivityCard';

export { ActivityCard, activityCardVariants };