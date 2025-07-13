import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { useTranslation } from 'react-i18next';
import { Loader2, Plane, MapPin, Calendar } from 'lucide-react';
import { cn } from '../../lib/utils';

const loadingStateVariants = cva(
  'flex flex-col items-center justify-center text-center',
  {
    variants: {
      preset: {
        default: 'py-12 px-6',
        travel: 'py-16 px-8 bg-gradient-to-b from-blue-50 to-purple-50 rounded-lg',
        minimal: 'py-8 px-4',
        fullscreen: 'min-h-screen py-0 px-6',
      },
      size: {
        small: 'space-y-2',
        default: 'space-y-4',
        large: 'space-y-6',
      },
    },
    defaultVariants: {
      preset: 'default',
      size: 'default',
    },
  }
);

const spinnerVariants = cva(
  'animate-spin',
  {
    variants: {
      size: {
        small: 'w-4 h-4',
        default: 'w-8 h-8',
        large: 'w-12 h-12',
      },
      preset: {
        default: 'text-primary',
        travel: 'text-blue-500',
        minimal: 'text-muted-foreground',
        fullscreen: 'text-primary',
      },
    },
    defaultVariants: {
      size: 'default',
      preset: 'default',
    },
  }
);

export interface LoadingStateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingStateVariants> {
  message?: string;
  messageTx?: string;
  messageTxOptions?: Record<string, any>;
  
  spinnerSize?: 'small' | 'default' | 'large';
  customSpinner?: React.ReactNode;
  
  showIcon?: boolean;
  icon?: 'plane' | 'map' | 'calendar' | React.ReactNode;
  
  messageStyle?: string;
}

const LoadingState = React.forwardRef<HTMLDivElement, LoadingStateProps>(
  ({
    className,
    preset,
    size,
    message,
    messageTx,
    messageTxOptions,
    spinnerSize,
    customSpinner,
    showIcon = false,
    icon = 'plane',
    messageStyle,
    ...props
  }, ref) => {
    const { t } = useTranslation();
    
    const messageText = messageTx ? t(messageTx, messageTxOptions) : message || 'Loading...';
    
    const renderSpinner = () => {
      if (customSpinner) return customSpinner;
      
      return (
        <Loader2 className={cn(spinnerVariants({ 
          size: spinnerSize || size, 
          preset 
        }))} />
      );
    };
    
    const renderIcon = () => {
      if (!showIcon) return null;
      
      const iconMap = {
        plane: Plane,
        map: MapPin,
        calendar: Calendar,
      };
      
      const IconComponent = typeof icon === 'string' && icon in iconMap ? iconMap[icon as keyof typeof iconMap] : null;
      
      return (
        <div className="text-muted-foreground/30">
          {IconComponent ? (
            <IconComponent className="w-16 h-16" />
          ) : (
            icon
          )}
        </div>
      );
    };

    return (
      <div
        ref={ref}
        className={cn(loadingStateVariants({ preset, size, className }))}
        {...props}
      >
        {renderIcon()}
        {renderSpinner()}
        <p className={cn(
          'text-muted-foreground',
          size === 'small' && 'text-sm',
          size === 'large' && 'text-lg',
          messageStyle
        )}>
          {messageText}
        </p>
      </div>
    );
  }
);

LoadingState.displayName = 'LoadingState';

export { LoadingState, loadingStateVariants };