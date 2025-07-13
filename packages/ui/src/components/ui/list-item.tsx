import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { useTranslation } from 'react-i18next';
import { ChevronRight, MapPin, Calendar, Star, Plane } from 'lucide-react';
import { cn } from '../../lib/utils';

const listItemVariants = cva(
  'flex items-center w-full p-4 transition-colors',
  {
    variants: {
      preset: {
        default: 'hover:bg-accent border-b border-border last:border-b-0',
        travel: 'hover:bg-blue-50 border-b border-blue-100 last:border-b-0',
        card: 'rounded-lg border bg-card hover:bg-accent shadow-sm mb-2',
        minimal: 'hover:bg-accent/50 py-2',
      },
      size: {
        small: 'p-2',
        default: 'p-4',
        large: 'p-6',
      },
      interactive: {
        true: 'cursor-pointer',
        false: 'cursor-default',
      },
    },
    defaultVariants: {
      preset: 'default',
      size: 'default',
      interactive: true,
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
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onPress'>,
    VariantProps<typeof listItemVariants> {
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
  textStyle?: string;
  subTextStyle?: string;
  leftIconStyle?: string;
  rightIconStyle?: string;
  
  // States
  selected?: boolean;
  disabled?: boolean;
  
  // Badge/Status
  badge?: string | number;
  badgeColor?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

const ListItem = React.forwardRef<HTMLDivElement, ListItemProps>(
  ({
    className,
    preset,
    size,
    interactive,
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
    textStyle,
    subTextStyle,
    leftIconStyle,
    rightIconStyle,
    selected,
    disabled,
    badge,
    badgeColor = 'default',
    ...props
  }, ref) => {
    const { t } = useTranslation();
    
    const mainText = tx ? t(tx, txOptions) : text;
    const secondaryText = subTx ? t(subTx, subTxOptions) : subText;
    
    const isInteractive = interactive && onPress && !disabled;
    
    const renderLeftContent = () => {
      if (leftComponent) return leftComponent;
      
      if (!leftIcon) return null;
      
      const IconComponent = typeof leftIcon === 'string' && leftIcon in iconMap ? iconMap[leftIcon as keyof typeof iconMap] : null;
      
      return (
        <div className={cn('mr-3 flex-shrink-0', leftIconStyle)}>
          {IconComponent ? (
            <IconComponent className="h-5 w-5 text-muted-foreground" />
          ) : (
            leftIcon
          )}
        </div>
      );
    };
    
    const renderMainContent = () => (
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className={cn(
            'font-medium text-foreground truncate',
            disabled && 'text-muted-foreground',
            selected && 'text-primary',
            textStyle
          )}>
            {mainText}
          </p>
          
          {badge && (
            <span className={cn(
              'ml-2 px-2 py-1 text-xs rounded-full flex-shrink-0',
              badgeColor === 'default' && 'bg-secondary text-secondary-foreground',
              badgeColor === 'success' && 'bg-green-100 text-green-800',
              badgeColor === 'warning' && 'bg-yellow-100 text-yellow-800',
              badgeColor === 'error' && 'bg-red-100 text-red-800',
              badgeColor === 'info' && 'bg-blue-100 text-blue-800'
            )}>
              {badge}
            </span>
          )}
        </div>
        
        {secondaryText && (
          <p className={cn(
            'text-sm text-muted-foreground truncate mt-1',
            disabled && 'opacity-50',
            subTextStyle
          )}>
            {secondaryText}
          </p>
        )}
      </div>
    );
    
    const renderRightContent = () => {
      if (rightComponent) return rightComponent;
      
      if (!rightIcon || !isInteractive) return null;
      
      const IconComponent = typeof rightIcon === 'string' && rightIcon in iconMap ? iconMap[rightIcon as keyof typeof iconMap] : null;
      
      return (
        <div className={cn('ml-3 flex-shrink-0', rightIconStyle)}>
          {IconComponent ? (
            <IconComponent className="h-4 w-4 text-muted-foreground" />
          ) : (
            rightIcon
          )}
        </div>
      );
    };
    
    const handleClick = () => {
      if (isInteractive) {
        onPress?.();
      }
    };
    
    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (isInteractive && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        onPress?.();
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          listItemVariants({ preset, size, interactive: isInteractive, className }),
          selected && 'bg-accent',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role={isInteractive ? 'button' : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        aria-disabled={disabled}
        {...props}
      >
        {renderLeftContent()}
        {renderMainContent()}
        {renderRightContent()}
      </div>
    );
  }
);

ListItem.displayName = 'ListItem';

export { ListItem, listItemVariants };