import { cva, type VariantProps } from 'class-variance-authority';
import { Calendar, MapPin, Plane } from 'lucide-react-native';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, View } from 'react-native';

import { Text } from '@/components/ui';

const loadingStateVariants = cva(
  'flex items-center justify-center text-center',
  {
    variants: {
      preset: {
        default: 'px-6 py-12',
        travel:
          'rounded-lg bg-gradient-to-b from-blue-50 to-purple-50 px-8 py-16',
        minimal: 'px-4 py-8',
        fullscreen: 'flex-1 px-6 py-0',
      },
      size: {
        small: '',
        default: '',
        large: '',
      },
    },
    defaultVariants: {
      preset: 'default',
      size: 'default',
    },
  }
);

export interface LoadingStateProps
  extends VariantProps<typeof loadingStateVariants> {
  message?: string;
  messageTx?: string;
  messageTxOptions?: Record<string, any>;

  spinnerSize?: 'small' | 'large';
  spinnerColor?: string;

  showIcon?: boolean;
  icon?: 'plane' | 'map' | 'calendar' | React.ReactNode;

  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  preset,
  size,
  message,
  messageTx,
  messageTxOptions,
  spinnerSize = 'large',
  spinnerColor,
  showIcon = false,
  icon = 'plane',
  className,
}) => {
  const { t } = useTranslation();

  const messageText = messageTx
    ? t(messageTx, messageTxOptions)
    : message || 'Loading...';

  const renderIcon = () => {
    if (!showIcon) return null;

    const iconMap = {
      plane: Plane,
      map: MapPin,
      calendar: Calendar,
    };

    const IconComponent =
      typeof icon === 'string' && icon in iconMap
        ? iconMap[icon as keyof typeof iconMap]
        : null;

    return (
      <View className="mb-4 opacity-30">
        {IconComponent ? (
          <IconComponent size={64} className="text-muted-foreground" />
        ) : (
          icon
        )}
      </View>
    );
  };

  return (
    <View className={loadingStateVariants({ preset, size, className })}>
      {renderIcon()}
      <ActivityIndicator
        size={spinnerSize}
        color={spinnerColor || (preset === 'travel' ? '#3B82F6' : '#6B7280')}
        className="mb-4"
      />
      <Text
        className={`text-muted-foreground ${
          size === 'small'
            ? 'text-sm'
            : size === 'large'
              ? 'text-lg'
              : 'text-base'
        }`}
      >
        {messageText}
      </Text>
    </View>
  );
};
