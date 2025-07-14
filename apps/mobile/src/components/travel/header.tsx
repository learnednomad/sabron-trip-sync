import { cva, type VariantProps } from 'class-variance-authority';
import {
  ArrowLeft,
  Menu,
  MoreVertical,
  Search,
  Settings,
} from 'lucide-react-native';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui';

const headerVariants = cva(
  'w-full flex-row items-center justify-between border-b px-4 py-3',
  {
    variants: {
      preset: {
        default: 'bg-background border-border',
        travel:
          'border-transparent bg-gradient-to-r from-blue-500 to-purple-600',
        transparent: 'border-transparent bg-transparent',
        elevated: 'bg-background border-border shadow-md',
      },
      size: {
        default: 'h-14',
        compact: 'h-12 py-2',
        large: 'h-16 py-4',
      },
    },
    defaultVariants: {
      preset: 'default',
      size: 'default',
    },
  }
);

const titleVariants = cva('font-semibold', {
  variants: {
    preset: {
      default: 'text-foreground',
      travel: 'text-white',
      transparent: 'text-foreground',
      elevated: 'text-foreground',
    },
    size: {
      default: 'text-lg',
      compact: 'text-base',
      large: 'text-xl',
    },
  },
  defaultVariants: {
    preset: 'default',
    size: 'default',
  },
});

const iconMap = {
  back: ArrowLeft,
  search: Search,
  menu: Menu,
  settings: Settings,
  more: MoreVertical,
} as const;

export interface HeaderProps extends VariantProps<typeof headerVariants> {
  title?: string;
  titleTx?: string;
  titleTxOptions?: Record<string, any>;

  leftIcon?: keyof typeof iconMap | React.ReactNode;
  rightIcon?: keyof typeof iconMap | React.ReactNode;

  onLeftPress?: () => void;
  onRightPress?: () => void;

  className?: string;

  showBackButton?: boolean;
  backButtonAccessibilityLabel?: string;

  centerComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;

  // Mobile specific
  safeArea?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  preset,
  size,
  title,
  titleTx,
  titleTxOptions,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  className,
  showBackButton = false,
  backButtonAccessibilityLabel = 'Go back',
  centerComponent,
  rightComponent,
  leftComponent,
  safeArea = true,
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const titleText = titleTx ? t(titleTx, titleTxOptions) : title;

  const renderLeftContent = () => {
    if (leftComponent) return leftComponent;

    const iconToShow = showBackButton ? 'back' : leftIcon;
    const pressHandler = showBackButton ? onLeftPress : onLeftPress;

    if (!iconToShow || !pressHandler) {
      return <View className="size-10" />; // Spacer
    }

    const IconComponent =
      typeof iconToShow === 'string' && iconToShow in iconMap
        ? iconMap[iconToShow as keyof typeof iconMap]
        : null;

    return (
      <TouchableOpacity
        onPress={pressHandler}
        className={`size-10 items-center justify-center rounded-lg ${
          preset === 'travel' ? 'active:bg-white/20' : 'active:bg-accent'
        }`}
        activeOpacity={0.7}
        accessibilityLabel={
          showBackButton ? backButtonAccessibilityLabel : undefined
        }
      >
        {IconComponent ? (
          <IconComponent
            size={20}
            className={preset === 'travel' ? 'text-white' : 'text-foreground'}
          />
        ) : (
          iconToShow
        )}
      </TouchableOpacity>
    );
  };

  const renderCenterContent = () => {
    if (centerComponent) return centerComponent;

    if (!titleText) return null;

    return (
      <Text className={titleVariants({ preset, size })} numberOfLines={1}>
        {titleText}
      </Text>
    );
  };

  const renderRightContent = () => {
    if (rightComponent) return rightComponent;

    if (!rightIcon || !onRightPress) {
      return <View className="size-10" />; // Spacer
    }

    const IconComponent =
      typeof rightIcon === 'string' && rightIcon in iconMap
        ? iconMap[rightIcon as keyof typeof iconMap]
        : null;

    return (
      <TouchableOpacity
        onPress={onRightPress}
        className={`size-10 items-center justify-center rounded-lg ${
          preset === 'travel' ? 'active:bg-white/20' : 'active:bg-accent'
        }`}
        activeOpacity={0.7}
      >
        {IconComponent ? (
          <IconComponent
            size={20}
            className={preset === 'travel' ? 'text-white' : 'text-foreground'}
          />
        ) : (
          rightIcon
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View
      className={headerVariants({ preset, size, className })}
      style={{ paddingTop: safeArea ? insets.top : 0 }}
    >
      {renderLeftContent()}
      <View className="flex-1 items-center px-4">{renderCenterContent()}</View>
      {renderRightContent()}
    </View>
  );
};
