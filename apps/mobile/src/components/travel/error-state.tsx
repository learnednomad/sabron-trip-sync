import * as React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Wifi, RefreshCw } from 'lucide-react-native';
import { Text } from '@/components/ui';

const errorStateVariants = cva(
  'flex items-center justify-center text-center',
  {
    variants: {
      preset: {
        default: 'py-12 px-6',
        travel: 'py-16 px-8 bg-gradient-to-b from-red-50 to-orange-50 rounded-lg',
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

export interface ErrorStateProps
  extends VariantProps<typeof errorStateVariants> {
  message?: string;
  messageTx?: string;
  messageTxOptions?: Record<string, any>;
  
  title?: string;
  titleTx?: string;
  titleTxOptions?: Record<string, any>;
  
  button?: string;
  buttonTx?: string;
  buttonTxOptions?: Record<string, any>;
  
  onRetry?: () => void;
  
  showIcon?: boolean;
  icon?: 'alert' | 'network' | React.ReactNode;
  
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  preset,
  size,
  message,
  messageTx,
  messageTxOptions,
  title,
  titleTx,
  titleTxOptions,
  button,
  buttonTx,
  buttonTxOptions,
  onRetry,
  showIcon = true,
  icon = 'alert',
  className,
}) => {
  const { t } = useTranslation();
  
  const messageText = messageTx ? t(messageTx, messageTxOptions) : message || 'Something went wrong';
  const titleText = titleTx ? t(titleTx, titleTxOptions) : title || 'Error';
  const buttonText = buttonTx ? t(buttonTx, buttonTxOptions) : button || 'Try Again';
  
  const renderIcon = () => {
    if (!showIcon) return null;
    
    const iconMap = {
      alert: AlertCircle,
      network: Wifi,
    };
    
    const IconComponent = typeof icon === 'string' && icon in iconMap ? iconMap[icon as keyof typeof iconMap] : null;
    
    return (
      <View className="mb-4">
        {IconComponent ? (
          <IconComponent size={64} className="text-red-500" />
        ) : (
          icon
        )}
      </View>
    );
  };

  const renderButton = () => {
    if (!onRetry) return null;
    
    return (
      <TouchableOpacity
        onPress={onRetry}
        className="flex-row items-center justify-center bg-primary rounded-lg px-6 py-3 mt-4"
        activeOpacity={0.8}
      >
        <RefreshCw size={16} className="text-primary-foreground mr-2" />
        <Text className="text-primary-foreground font-medium">
          {buttonText}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className={errorStateVariants({ preset, size, className })}>
      {renderIcon()}
      <Text className={`font-semibold text-foreground mb-2 ${
        size === 'small' ? 'text-base' : size === 'large' ? 'text-xl' : 'text-lg'
      }`}>
        {titleText}
      </Text>
      <Text className={`text-muted-foreground text-center ${
        size === 'small' ? 'text-sm' : 'text-base'
      }`}>
        {messageText}
      </Text>
      {renderButton()}
    </View>
  );
};