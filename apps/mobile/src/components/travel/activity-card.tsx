import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';
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
} from 'lucide-react-native';
import { Text } from '@/components/ui';

const activityCardVariants = cva(
  'group relative rounded-lg border bg-card p-4',
  {
    variants: {
      preset: {
        default: 'border-border',
        travel: 'border-blue-200 bg-gradient-to-br from-white to-blue-50',
        timeline: 'border-l-4 border-l-blue-500 pl-6 border-border',
        compact: 'p-3 border-border',
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
    },
    defaultVariants: {
      preset: 'default',
      status: 'planned',
      size: 'default',
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
  extends VariantProps<typeof activityCardVariants> {
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
  className?: string;
  
  // Show/hide elements
  showTime?: boolean;
  showLocation?: boolean;
  showCost?: boolean;
  showRating?: boolean;
  showParticipants?: boolean;
  showCategory?: boolean;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  preset,
  status,
  size,
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
  className,
  showTime = true,
  showLocation = true,
  showCost = false,
  showRating = false,
  showParticipants = false,
  showCategory = true,
}) => {
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
  
  const renderCategoryIcon = () => {
    const IconComponent = categoryIcons[category];
    return <IconComponent size={20} className="text-blue-500" />;
  };
  
  const renderRating = () => {
    if (!showRating || !rating) return null;
    
    return (
      <View className="flex-row items-center space-x-1">
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            key={i}
            size={16}
            className={i < rating ? 'text-yellow-400' : 'text-gray-300'}
            fill={i < rating ? 'currentColor' : 'none'}
          />
        ))}
        <Text className="text-sm text-muted-foreground ml-1">
          {rating}/{maxRating}
        </Text>
      </View>
    );
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={activityCardVariants({ preset, status, size, className })}
    >
      <View className="flex-1 space-y-2">
        {/* Header with title and category */}
        <View className="flex-row items-start justify-between">
          <View className="flex-row items-center space-x-2 flex-1">
            {showCategory && renderCategoryIcon()}
            <Text className={`font-semibold text-foreground flex-1 ${
              size === 'small' ? 'text-sm' : size === 'large' ? 'text-lg' : 'text-base'
            }`}>
              {titleText}
            </Text>
          </View>
          
          <View className="flex-row items-center space-x-2">
            {showCategory && categoryText && (
              <View className="px-2 py-1 bg-blue-100 rounded-full">
                <Text className="text-xs text-blue-800">
                  {categoryText}
                </Text>
              </View>
            )}
            
            <View className={`px-2 py-1 rounded-full ${
              status === 'confirmed' ? 'bg-green-100' :
              status === 'completed' ? 'bg-gray-100' :
              status === 'cancelled' ? 'bg-red-100' :
              'bg-blue-100'
            }`}>
              <Text className={`text-xs ${
                status === 'confirmed' ? 'text-green-800' :
                status === 'completed' ? 'text-gray-800' :
                status === 'cancelled' ? 'text-red-800' :
                'text-blue-800'
              }`}>
                {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Description */}
        {descriptionText && (
          <Text className={`text-muted-foreground ${
            size === 'small' ? 'text-xs' : 'text-sm'
          }`}>
            {descriptionText}
          </Text>
        )}
        
        {/* Details row */}
        <View className="flex-row items-center justify-between">
          <View className="flex-col space-y-1 flex-1">
            {showTime && formatTime() && (
              <View className="flex-row items-center">
                <Clock size={16} className="text-muted-foreground mr-1" />
                <Text className="text-sm text-muted-foreground">
                  {formatTime()}
                  {durationText && ` (${durationText})`}
                </Text>
              </View>
            )}
            
            {showLocation && locationText && (
              <View className="flex-row items-center">
                <MapPin size={16} className="text-muted-foreground mr-1" />
                <Text className="text-sm text-muted-foreground flex-1" numberOfLines={1}>
                  {locationText}
                </Text>
              </View>
            )}
            
            {showParticipants && participants && (
              <View className="flex-row items-center">
                <Users size={16} className="text-muted-foreground mr-1" />
                <Text className="text-sm text-muted-foreground">
                  {participants}
                  {maxParticipants && `/${maxParticipants}`}
                </Text>
              </View>
            )}
          </View>
          
          <View className="flex-col items-end space-y-1">
            {showCost && cost && (
              <View className="flex-row items-center">
                <DollarSign size={16} className="text-muted-foreground mr-1" />
                <Text className="text-sm font-medium">
                  {cost.toLocaleString()} {currency}
                </Text>
              </View>
            )}
            
            {renderRating()}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};