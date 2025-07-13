import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { useTranslation } from 'react-i18next';
import { ChevronRight, MapPin, Calendar, Star, Plane } from 'lucide-react-native';
import { Text } from '@/components/ui';

const listItemVariants = cva(
  'flex-row items-center w-full p-4',
  {
    variants: {
      preset: {
        default: 'border-b border-border',
        travel: 'border-b border-blue-100',
        card: 'rounded-lg border bg-card shadow-sm mb-2',
        minimal: 'py-2',
      },
      size: {
        small: 'p-2',
        default: 'p-4',
        large: 'p-6',
      },
    },
    defaultVariants: {
      preset: 'default',
      size: 'default',
    },
  }
);

const iconMap = {
  'map-pin': MapPin,
  'calendar': Calendar,
  'star': Star,
  'plane': Plane,
  'chevron-right': ChevronRight,
} as const;

export interface ListItemProps
  extends VariantProps<typeof listItemVariants> {
  // Content
  text?: string;
  tx?: string;
  txOptions?: Record<string, any>;
  
  // Secondary text
  subText?: string;
  subTx?: string;
  subTxOptions?: Record<string, any>;
  
  // Icons
  leftIcon?: keyof typeof iconMap | React.ReactNode;
  rightIcon?: keyof typeof iconMap | React.ReactNode;
  
  // Components
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  
  // Actions
  onPress?: () => void;
  
  // Styling
  className?: string;
  
  // States
  selected?: boolean;
  disabled?: boolean;
  
  // Badge/Status
  badge?: string | number;
  badgeColor?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export const ListItem: React.FC<ListItemProps> = ({
  preset,
  size,
  text,
  tx,
  txOptions,
  subText,
  subTx,
  subTxOptions,
  leftIcon,
  rightIcon = 'chevron-right',
  leftComponent,
  rightComponent,
  onPress,
  className,
  selected,
  disabled,
  badge,
  badgeColor = 'default',
}) => {
  const { t } = useTranslation();
  
  const mainText = tx ? t(tx, txOptions) : text;
  const secondaryText = subTx ? t(subTx, subTxOptions) : subText;
  
  const isInteractive = onPress && !disabled;
  
  const renderLeftContent = () => {
    if (leftComponent) return leftComponent;
    
    if (!leftIcon) return null;
    
    const IconComponent = typeof leftIcon === 'string' && leftIcon in iconMap ? iconMap[leftIcon as keyof typeof iconMap] : null;
    
    return (
      <View className="mr-3 flex-shrink-0">
        {IconComponent ? (
          <IconComponent size={20} className="text-muted-foreground" />
        ) : (
          leftIcon
        )}
      </View>
    );
  };
  
  const renderMainContent = () => (
    <View className="flex-1 min-w-0">
      <View className="flex-row items-center justify-between">
        <Text className={`font-medium flex-1 ${
          disabled ? 'text-muted-foreground' : selected ? 'text-primary' : 'text-foreground'
        }`} numberOfLines={1}>
          {mainText}
        </Text>
        
        {badge && (
          <View className={`ml-2 px-2 py-1 rounded-full ${
            badgeColor === 'default' ? 'bg-secondary' :
            badgeColor === 'success' ? 'bg-green-100' :
            badgeColor === 'warning' ? 'bg-yellow-100' :
            badgeColor === 'error' ? 'bg-red-100' :
            badgeColor === 'info' ? 'bg-blue-100' :
            'bg-secondary'
          }`}>
            <Text className={`text-xs ${
              badgeColor === 'default' ? 'text-secondary-foreground' :
              badgeColor === 'success' ? 'text-green-800' :
              badgeColor === 'warning' ? 'text-yellow-800' :
              badgeColor === 'error' ? 'text-red-800' :
              badgeColor === 'info' ? 'text-blue-800' :
              'text-secondary-foreground'
            }`}>
              {badge}
            </Text>
          </View>
        )}
      </View>
      
      {secondaryText && (
        <Text className={`text-sm text-muted-foreground mt-1 ${
          disabled ? 'opacity-50' : ''
        }`} numberOfLines={1}>
          {secondaryText}
        </Text>
      )}
    </View>
  );
  
  const renderRightContent = () => {
    if (rightComponent) return rightComponent;
    
    if (!rightIcon || !isInteractive) return null;
    
    const IconComponent = typeof rightIcon === 'string' && rightIcon in iconMap ? iconMap[rightIcon as keyof typeof iconMap] : null;
    
    return (
      <View className="ml-3 flex-shrink-0">
        {IconComponent ? (
          <IconComponent size={16} className="text-muted-foreground" />
        ) : (
          rightIcon
        )}
      </View>
    );
  };

  const Component = isInteractive ? TouchableOpacity : View;

  return (
    <Component
      onPress={isInteractive ? onPress : undefined}
      activeOpacity={isInteractive ? 0.7 : 1}
      className={`${listItemVariants({ preset, size, className })} ${
        selected ? 'bg-accent' : ''
      } ${disabled ? 'opacity-50' : ''}`}
      disabled={disabled}
    >
      {renderLeftContent()}
      {renderMainContent()}
      {renderRightContent()}
    </Component>
  );
};