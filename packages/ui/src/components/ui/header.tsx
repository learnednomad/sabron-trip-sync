import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Search, Menu, Settings, MoreVertical } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './button';

const headerVariants = cva(
  'flex items-center justify-between w-full px-4 py-3 border-b',
  {
    variants: {
      preset: {
        default: 'bg-background border-border',
        travel: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-transparent',
        transparent: 'bg-transparent border-transparent',
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

const titleVariants = cva(
  'font-semibold truncate',
  {
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
  }
);

const iconMap = {
  back: ArrowLeft,
  search: Search,
  menu: Menu,
  settings: Settings,
  more: MoreVertical,
} as const;

export interface HeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof headerVariants> {
  title?: string;
  titleTx?: string;
  titleTxOptions?: Record<string, any>;
  
  leftIcon?: keyof typeof iconMap | React.ReactNode;
  rightIcon?: keyof typeof iconMap | React.ReactNode;
  
  onLeftPress?: () => void;
  onRightPress?: () => void;
  
  titleStyle?: string;
  leftButtonStyle?: string;
  rightButtonStyle?: string;
  
  showBackButton?: boolean;
  backButtonAccessibilityLabel?: string;
  
  centerComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;
}

const Header = React.forwardRef<HTMLDivElement, HeaderProps>(
  ({
    className,
    preset,
    size,
    title,
    titleTx,
    titleTxOptions,
    leftIcon,
    rightIcon,
    onLeftPress,
    onRightPress,
    titleStyle,
    leftButtonStyle,
    rightButtonStyle,
    showBackButton = false,
    backButtonAccessibilityLabel = 'Go back',
    centerComponent,
    rightComponent,
    leftComponent,
    ...props
  }, ref) => {
    const { t } = useTranslation();
    
    const titleText = titleTx ? t(titleTx, titleTxOptions) : title;
    
    const renderLeftContent = () => {
      if (leftComponent) return leftComponent;
      
      const iconToShow = showBackButton ? 'back' : leftIcon;
      const pressHandler = showBackButton ? onLeftPress : onLeftPress;
      
      if (!iconToShow || !pressHandler) return <div className="w-10" />; // Spacer
      
      const IconComponent = typeof iconToShow === 'string' && iconToShow in iconMap ? iconMap[iconToShow as keyof typeof iconMap] : null;
      
      return (
        <Button
          variant="ghost"
          size="icon"
          onClick={pressHandler}
          className={cn(
            'h-10 w-10',
            preset === 'travel' && 'text-white hover:bg-white/20',
            leftButtonStyle
          )}
          aria-label={showBackButton ? backButtonAccessibilityLabel : undefined}
        >
          {IconComponent ? (
            <IconComponent className="h-5 w-5" />
          ) : (
            iconToShow
          )}
        </Button>
      );
    };
    
    const renderCenterContent = () => {
      if (centerComponent) return centerComponent;
      
      if (!titleText) return null;
      
      return (
        <h1 className={cn(titleVariants({ preset, size }), titleStyle)}>
          {titleText}
        </h1>
      );
    };
    
    const renderRightContent = () => {
      if (rightComponent) return rightComponent;
      
      if (!rightIcon || !onRightPress) return <div className="w-10" />; // Spacer
      
      const IconComponent = typeof rightIcon === 'string' && rightIcon in iconMap ? iconMap[rightIcon as keyof typeof iconMap] : null;
      
      return (
        <Button
          variant="ghost"
          size="icon"
          onClick={onRightPress}
          className={cn(
            'h-10 w-10',
            preset === 'travel' && 'text-white hover:bg-white/20',
            rightButtonStyle
          )}
        >
          {IconComponent ? (
            <IconComponent className="h-5 w-5" />
          ) : (
            rightIcon
          )}
        </Button>
      );
    };

    return (
      <header
        ref={ref}
        className={cn(headerVariants({ preset, size, className }))}
        {...props}
      >
        {renderLeftContent()}
        <div className="flex-1 flex justify-center px-4">
          {renderCenterContent()}
        </div>
        {renderRightContent()}
      </header>
    );
  }
);

Header.displayName = 'Header';

export { Header, headerVariants };