import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Wifi, Server, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './button';

const errorStateVariants = cva(
  'flex flex-col items-center justify-center text-center',
  {
    variants: {
      preset: {
        default: 'py-12 px-6',
        travel: 'py-16 px-8 bg-gradient-to-b from-red-50 to-orange-50 rounded-lg',
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

export interface ErrorStateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof errorStateVariants> {
  title?: string;
  titleTx?: string;
  titleTxOptions?: Record<string, any>;
  
  message?: string;
  messageTx?: string;
  messageTxOptions?: Record<string, any>;
  
  // Error types
  errorType?: 'network' | 'server' | 'generic';
  
  // Retry functionality
  onRetry?: () => void;
  retryButtonText?: string;
  retryButtonTx?: string;
  retryButtonTxOptions?: Record<string, any>;
  
  // Custom action
  actionButtonText?: string;
  actionButtonTx?: string;
  actionButtonTxOptions?: Record<string, any>;
  onAction?: () => void;
  
  // Icon
  icon?: React.ReactNode;
  showIcon?: boolean;
  
  // Styling
  titleStyle?: string;
  messageStyle?: string;
  retryButtonStyle?: string;
  actionButtonStyle?: string;
}

const ErrorState = React.forwardRef<HTMLDivElement, ErrorStateProps>(
  ({
    className,
    preset,
    size,
    title,
    titleTx,
    titleTxOptions,
    message,
    messageTx,
    messageTxOptions,
    errorType = 'generic',
    onRetry,
    retryButtonText,
    retryButtonTx,
    retryButtonTxOptions,
    actionButtonText,
    actionButtonTx,
    actionButtonTxOptions,
    onAction,
    icon,
    showIcon = true,
    titleStyle,
    messageStyle,
    retryButtonStyle,
    actionButtonStyle,
    ...props
  }, ref) => {
    const { t } = useTranslation();
    
    // Default messages based on error type
    const getDefaultTitle = () => {
      switch (errorType) {
        case 'network':
          return 'Connection Error';
        case 'server':
          return 'Server Error';
        default:
          return 'Something went wrong';
      }
    };
    
    const getDefaultMessage = () => {
      switch (errorType) {
        case 'network':
          return 'Please check your internet connection and try again.';
        case 'server':
          return 'Our servers are experiencing issues. Please try again later.';
        default:
          return 'An unexpected error occurred. Please try again.';
      }
    };
    
    const titleText = titleTx ? t(titleTx, titleTxOptions) : title || getDefaultTitle();
    const messageText = messageTx ? t(messageTx, messageTxOptions) : message || getDefaultMessage();
    const retryText = retryButtonTx ? t(retryButtonTx, retryButtonTxOptions) : retryButtonText || 'Try Again';
    const actionText = actionButtonTx ? t(actionButtonTx, actionButtonTxOptions) : actionButtonText;
    
    const renderIcon = () => {
      if (!showIcon) return null;
      
      if (icon) return icon;
      
      const iconMap = {
        network: Wifi,
        server: Server,
        generic: AlertTriangle,
      };
      
      const IconComponent = iconMap[errorType];
      
      return (
        <div className="text-destructive/60 mb-2">
          <IconComponent className="w-12 h-12" />
        </div>
      );
    };
    
    const renderActions = () => {
      const hasRetry = onRetry;
      const hasAction = onAction && actionText;
      
      if (!hasRetry && !hasAction) return null;
      
      return (
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          {hasRetry && (
            <Button
              onClick={onRetry}
              preset="primary"
              className={cn('min-w-[120px]', retryButtonStyle)}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {retryText}
            </Button>
          )}
          
          {hasAction && (
            <Button
              onClick={onAction}
              preset="secondary"
              className={cn('min-w-[120px]', actionButtonStyle)}
            >
              {actionText}
            </Button>
          )}
        </div>
      );
    };

    return (
      <div
        ref={ref}
        className={cn(errorStateVariants({ preset, size, className }))}
        {...props}
      >
        {renderIcon()}
        
        <div className="space-y-2">
          <h3 className={cn(
            'font-semibold text-foreground',
            size === 'small' && 'text-base',
            size === 'default' && 'text-lg',
            size === 'large' && 'text-xl',
            titleStyle
          )}>
            {titleText}
          </h3>
          
          <p className={cn(
            'text-muted-foreground max-w-md',
            size === 'small' && 'text-sm',
            size === 'large' && 'text-base',
            messageStyle
          )}>
            {messageText}
          </p>
        </div>
        
        {renderActions()}
      </div>
    );
  }
);

ErrorState.displayName = 'ErrorState';

export { ErrorState, errorStateVariants };