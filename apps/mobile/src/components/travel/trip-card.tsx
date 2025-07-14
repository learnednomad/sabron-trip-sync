import { cva, type VariantProps } from 'class-variance-authority';
import { Image } from 'expo-image';
import { Calendar, Clock, DollarSign, Users } from 'lucide-react-native';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';

import { Text } from '@/components/ui';

const tripCardVariants = cva(
  'bg-card group relative overflow-hidden rounded-lg border',
  {
    variants: {
      preset: {
        default: 'border-border',
        elevated: 'border-0 shadow-lg',
        travel: 'border-blue-200 bg-gradient-to-br from-white to-blue-50',
        compact: 'border-border',
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
    },
    defaultVariants: {
      preset: 'default',
      size: 'default',
      layout: 'vertical',
    },
  }
);

const statusVariants = cva(
  'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
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

export interface TripCardProps extends VariantProps<typeof tripCardVariants> {
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
  className?: string;

  // Show/hide elements
  showImage?: boolean;
  showStatus?: boolean;
  showBudget?: boolean;
  showParticipants?: boolean;
  showDuration?: boolean;
}

export const TripCard: React.FC<TripCardProps> = ({
  preset,
  size,
  layout,
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
  imageFallback = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=250&fit=crop',
  status = 'planning',
  participants,
  budget,
  currency = 'USD',
  onPress,
  onEdit,
  onShare,
  className,
  showImage = true,
  showStatus = true,
  showBudget = false,
  showParticipants = false,
  showDuration = true,
}) => {
  const { t } = useTranslation();

  const destinationText = destinationTx
    ? t(destinationTx, destinationTxOptions)
    : destination;
  const datesText = datesTx ? t(datesTx, datesTxOptions) : dates;
  const durationText = durationTx ? t(durationTx, durationTxOptions) : duration;

  const formatDateRange = () => {
    if (datesText) return datesText;

    if (startDate && endDate) {
      return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
    }

    return null;
  };

  const renderImage = () => {
    if (!showImage) return null;

    return (
      <View
        className={
          layout === 'vertical' ? 'aspect-[16/10] w-full' : 'h-24 w-32 shrink-0'
        }
      >
        <Image
          source={{ uri: imageUrl || imageFallback }}
          className="size-full rounded-lg"
          contentFit="cover"
          transition={200}
        />

        {showStatus && (
          <View className="absolute right-2 top-2">
            <View className={statusVariants({ status })}>
              <Text className="text-xs font-medium">
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderContent = () => (
    <View
      className={`flex-1 space-y-2 ${layout === 'horizontal' ? 'ml-3' : 'mt-2'}`}
    >
      <View className="flex-row items-start justify-between">
        <Text className="text-foreground flex-1 text-lg font-semibold">
          {destinationText}
        </Text>
      </View>

      <View className="space-y-1">
        {formatDateRange() && (
          <View className="flex-row items-center">
            <Calendar size={16} className="text-muted-foreground mr-1" />
            <Text className="text-muted-foreground text-sm">
              {formatDateRange()}
            </Text>
          </View>
        )}

        {showDuration && durationText && (
          <View className="flex-row items-center">
            <Clock size={16} className="text-muted-foreground mr-1" />
            <Text className="text-muted-foreground text-sm">
              {durationText}
            </Text>
          </View>
        )}

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center space-x-3">
            {showParticipants && participants && (
              <View className="flex-row items-center">
                <Users size={16} className="text-muted-foreground mr-1" />
                <Text className="text-muted-foreground text-sm">
                  {participants}
                </Text>
              </View>
            )}

            {showBudget && budget && (
              <View className="flex-row items-center">
                <DollarSign size={16} className="text-muted-foreground mr-1" />
                <Text className="text-muted-foreground text-sm">
                  {budget.toLocaleString()} {currency}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={tripCardVariants({ preset, size, layout, className })}
    >
      {layout === 'vertical' ? (
        <View>
          {renderImage()}
          {renderContent()}
        </View>
      ) : (
        <View className="flex-row items-start">
          {renderImage()}
          {renderContent()}
        </View>
      )}
    </TouchableOpacity>
  );
};
