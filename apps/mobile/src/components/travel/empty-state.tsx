import { cva, type VariantProps } from 'class-variance-authority';
import { MapPin, Package, Plus, Search } from 'lucide-react-native';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';

import { Text } from '@/components/ui';

const emptyStateVariants = cva('flex items-center justify-center text-center', {
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
});

export interface EmptyStateProps
  extends VariantProps<typeof emptyStateVariants> {
  heading?: string;
  headingTx?: string;
  headingTxOptions?: Record<string, any>;

  content?: string;
  contentTx?: string;
  contentTxOptions?: Record<string, any>;

  button?: string;
  buttonTx?: string;
  buttonTxOptions?: Record<string, any>;

  buttonOnPress?: () => void;

  showIcon?: boolean;
  icon?: 'package' | 'search' | 'plus' | 'map' | React.ReactNode;

  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  preset,
  size,
  heading,
  headingTx,
  headingTxOptions,
  content,
  contentTx,
  contentTxOptions,
  button,
  buttonTx,
  buttonTxOptions,
  buttonOnPress,
  showIcon = true,
  icon = 'package',
  className,
}) => {
  const { t } = useTranslation();

  const headingText = headingTx
    ? t(headingTx, headingTxOptions)
    : heading || 'No items found';
  const contentText = contentTx
    ? t(contentTx, contentTxOptions)
    : content || 'There are no items to display at the moment.';
  const buttonText = buttonTx ? t(buttonTx, buttonTxOptions) : button;

  const renderIcon = () => {
    if (!showIcon) return null;

    const iconMap = {
      package: Package,
      search: Search,
      plus: Plus,
      map: MapPin,
    };

    const IconComponent =
      typeof icon === 'string' && icon in iconMap
        ? iconMap[icon as keyof typeof iconMap]
        : null;

    return (
      <View className="mb-6 opacity-40">
        {IconComponent ? (
          <IconComponent size={80} className="text-muted-foreground" />
        ) : (
          icon
        )}
      </View>
    );
  };

  const renderButton = () => {
    if (!buttonText || !buttonOnPress) return null;

    return (
      <TouchableOpacity
        onPress={buttonOnPress}
        className={`mt-6 flex-row items-center justify-center rounded-lg px-6 py-3 ${
          preset === 'travel'
            ? 'bg-gradient-to-r from-blue-500 to-purple-600'
            : 'bg-primary'
        }`}
        activeOpacity={0.8}
      >
        <Plus size={16} className="mr-2 text-white" />
        <Text className="font-medium text-white">{buttonText}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className={emptyStateVariants({ preset, size, className })}>
      {renderIcon()}
      <Text
        className={`text-foreground mb-3 text-center font-semibold ${
          size === 'small'
            ? 'text-base'
            : size === 'large'
              ? 'text-xl'
              : 'text-lg'
        }`}
      >
        {headingText}
      </Text>
      <Text
        className={`text-muted-foreground max-w-xs text-center ${
          size === 'small' ? 'text-sm' : 'text-base'
        }`}
      >
        {contentText}
      </Text>
      {renderButton()}
    </View>
  );
};
