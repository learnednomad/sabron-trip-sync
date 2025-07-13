import * as React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { useTranslation } from 'react-i18next';
import { Plane, MapPin, Calendar } from 'lucide-react-native';
import { Text } from '@/components/ui';

const loadingStateVariants = cva(
  'flex items-center justify-center text-center',
  {
    variants: {
      preset: {
        default: 'py-12 px-6',
        travel: 'py-16 px-8 bg-gradient-to-b from-blue-50 to-purple-50 rounded-lg',
        minimal: 'py-8 px-4',
        fullscreen: 'flex-1 py-0 px-6',
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
  
  const messageText = messageTx ? t(messageTx, messageTxOptions) : message || 'Loading...';
  
  const renderIcon = () => {
    if (!showIcon) return null;
    
    const iconMap = {
      plane: Plane,
      map: MapPin,
      calendar: Calendar,
    };
    
    const IconComponent = typeof icon === 'string' && icon in iconMap ? iconMap[icon as keyof typeof iconMap] : null;
    
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
      <Text className={`text-muted-foreground ${
        size === 'small' ? 'text-sm' : size === 'large' ? 'text-lg' : 'text-base'
      }`}>
        {messageText}
      </Text>
    </View>
  );
};