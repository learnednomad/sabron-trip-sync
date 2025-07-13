import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, Users, DollarSign } from 'lucide-react';
import { cn } from '../../lib/utils';
import { AutoImage } from './auto-image';
import { Badge } from './badge';

const tripCardVariants = cva(
  'group relative overflow-hidden rounded-lg border bg-card transition-all duration-200',
  {
    variants: {
      preset: {
        default: 'hover:shadow-md border-border',
        elevated: 'shadow-lg hover:shadow-xl border-0',
        travel: 'border-blue-200 hover:border-blue-300 hover:shadow-lg bg-gradient-to-br from-white to-blue-50',
        compact: 'border-border hover:bg-accent',
      },
      size: {
        small: 'p-3',
        default: 'p-4',
        large: 'p-6',
      },
      layout: {
        vertical: 'flex-col',
        horizontal: 'flex-row',
      },
      interactive: {
        true: 'cursor-pointer',
        false: 'cursor-default',
      },
    },
    defaultVariants: {
      preset: 'default',
      size: 'default',
      layout: 'vertical',
      interactive: true,
    },
  }
);

const statusVariants = cva(
  'inline-flex items-center px-2 py-1 text-xs font-medium rounded-full',
  {
    variants: {
      status: {
        planning: 'bg-blue-100 text-blue-800',
        upcoming: 'bg-green-100 text-green-800',
        active: 'bg-orange-100 text-orange-800',
        completed: 'bg-gray-100 text-gray-800',
        cancelled: 'bg-red-100 text-red-800',
      },
    },
  }
);

export interface TripCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onPress'>,
    VariantProps<typeof tripCardVariants> {
  // Trip data
  destination: string;
  destinationTx?: string;
  destinationTxOptions?: Record<string, any>;
  
  dates?: string;
  datesTx?: string;
  datesTxOptions?: Record<string, any>;
  
  startDate?: Date;
  endDate?: Date;
  
  duration?: string;
  durationTx?: string;
  durationTxOptions?: Record<string, any>;
  
  // Image
  imageUrl?: string;
  imageFallback?: string;
  
  // Status
  status?: 'planning' | 'upcoming' | 'active' | 'completed' | 'cancelled';
  
  // Additional info
  participants?: number;
  budget?: number;
  currency?: string;
  
  // Actions
  onPress?: () => void;
  onEdit?: () => void;
  onShare?: () => void;
  
  // Styling
  imageStyle?: string;
  contentStyle?: string;
  
  // Show/hide elements
  showImage?: boolean;
  showStatus?: boolean;
  showBudget?: boolean;
  showParticipants?: boolean;
  showDuration?: boolean;
}

const TripCard = React.forwardRef<HTMLDivElement, TripCardProps>(
  ({
    className,
    preset,
    size,
    layout,
    interactive,
    destination,
    destinationTx,
    destinationTxOptions,
    dates,
    datesTx,
    datesTxOptions,
    startDate,
    endDate,
    duration,
    durationTx,
    durationTxOptions,
    imageUrl,
    imageFallback = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=250&fit=crop",
    status = 'planning',
    participants,
    budget,
    currency = 'USD',
    onPress,
    onEdit,
    onShare,
    imageStyle,
    contentStyle,
    showImage = true,
    showStatus = true,
    showBudget = false,
    showParticipants = false,
    showDuration = true,
    ...props
  }, ref) => {
    const { t } = useTranslation();
    
    const destinationText = destinationTx ? t(destinationTx, destinationTxOptions) : destination;
    const datesText = datesTx ? t(datesTx, datesTxOptions) : dates;
    const durationText = durationTx ? t(durationTx, durationTxOptions) : duration;
    
    const formatDateRange = () => {
      if (datesText) return datesText;
      
      if (startDate && endDate) {
        return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
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
    
    const renderImage = () => {
      if (!showImage) return null;
      
      return (
        <div className={cn(
          'relative overflow-hidden',
          layout === 'vertical' ? 'aspect-[16/10] w-full' : 'w-32 h-24 flex-shrink-0',
          imageStyle
        )}>
          <AutoImage
            src={imageUrl}
            fallback={imageFallback}
            alt={destinationText}
            preset="cover"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          
          {showStatus && (
            <div className="absolute top-2 right-2">
              <div className={statusVariants({ status })}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </div>
            </div>
          )}
        </div>
      );
    };
    
    const renderContent = () => (
      <div className={cn(
        'flex flex-col space-y-2',
        layout === 'horizontal' && 'flex-1 ml-3',
        contentStyle
      )}>
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-foreground text-lg truncate">
            {destinationText}
          </h3>
        </div>
        
        <div className="space-y-1">
          {formatDateRange() && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDateRange()}
            </div>
          )}
          
          {showDuration && durationText && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mr-1" />
              {durationText}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {showParticipants && participants && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="w-4 h-4 mr-1" />
                  {participants}
                </div>
              )}
              
              {showBudget && budget && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <DollarSign className="w-4 h-4 mr-1" />
                  {budget.toLocaleString()} {currency}
                </div>
              )}
            </div>
            
            {!showStatus && status && (
              <Badge 
                variant={
                  status === 'completed' ? 'secondary' :
                  status === 'active' ? 'default' :
                  status === 'cancelled' ? 'destructive' :
                  'outline'
                }
                className="text-xs"
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
            )}
          </div>
        </div>
      </div>
    );

    return (
      <div
        ref={ref}
        className={cn(tripCardVariants({ preset, size, layout, interactive, className }))}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role={interactive && onPress ? 'button' : undefined}
        tabIndex={interactive && onPress ? 0 : undefined}
        {...props}
      >
        {layout === 'vertical' ? (
          <>
            {renderImage()}
            <div className="p-1">
              {renderContent()}
            </div>
          </>
        ) : (
          <div className="flex items-start">
            {renderImage()}
            {renderContent()}
          </div>
        )}
      </div>
    );
  }
);

TripCard.displayName = 'TripCard';

export { TripCard, tripCardVariants };