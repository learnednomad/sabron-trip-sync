import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';
import { Button } from './button';

const emptyStateVariants = cva(
  'flex flex-col items-center justify-center text-center',
  {
    variants: {
      preset: {
        default: 'py-12 px-6',
        compact: 'py-8 px-4',
        spacious: 'py-16 px-8',
        travel: 'py-12 px-6 bg-gradient-to-b from-blue-50 to-purple-50 rounded-lg',
      },
      size: {
        sm: 'max-w-sm',
        default: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        full: 'w-full',
      },
    },
    defaultVariants: {
      preset: 'default',
      size: 'default',
    },
  }
);

export interface EmptyStateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyStateVariants> {
  imageSource?: string;
  imageStyle?: string;
  ImageProps?: React.ImgHTMLAttributes<HTMLImageElement>;
  
  icon?: React.ReactNode;
  iconStyle?: string;
  
  heading?: string;
  headingTx?: string;
  headingTxOptions?: Record<string, any>;
  headingStyle?: string;
  HeadingTextProps?: React.HTMLAttributes<HTMLHeadingElement>;
  
  content?: string;
  contentTx?: string;
  contentTxOptions?: Record<string, any>;
  contentStyle?: string;
  ContentTextProps?: React.HTMLAttributes<HTMLParagraphElement>;
  
  button?: string;
  buttonTx?: string;
  buttonTxOptions?: Record<string, any>;
  buttonOnPress?: () => void;
  buttonStyle?: string;
  buttonPreset?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'travel';
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({
    className,
    preset,
    size,
    imageSource,
    imageStyle,
    ImageProps = {},
    icon,
    iconStyle,
    heading,
    headingTx,
    headingTxOptions,
    headingStyle,
    HeadingTextProps = {},
    content,
    contentTx,
    contentTxOptions,
    contentStyle,
    ContentTextProps = {},
    button,
    buttonTx,
    buttonTxOptions,
    buttonOnPress,
    buttonStyle,
    buttonPreset = 'primary',
    children,
    ...props
  }, ref) => {
    const { t } = useTranslation();

    const headingText = headingTx ? t(headingTx, headingTxOptions) : heading;
    const contentText = contentTx ? t(contentTx, contentTxOptions) : content;
    const buttonText = buttonTx ? t(buttonTx, buttonTxOptions) : button;

    const renderImage = () => {
      if (!imageSource && !icon) return null;
      
      if (icon) {
        return (
          <div className={cn('mb-6 text-6xl text-muted-foreground', iconStyle)}>
            {icon}
          </div>
        );
      }
      
      if (imageSource) {
        return (
          <img
            src={imageSource}
            alt=""
            {...ImageProps}
            className={cn(
              'mb-6 mx-auto max-w-xs opacity-60',
              imageStyle,
              ImageProps.className
            )}
          />
        );
      }
      
      return null;
    };

    const renderHeading = () => {
      if (!headingText) return null;
      
      return (
        <h3
          {...HeadingTextProps}
          className={cn(
            'text-xl font-semibold text-foreground mb-2',
            headingStyle,
            HeadingTextProps.className
          )}
        >
          {headingText}
        </h3>
      );
    };

    const renderContent = () => {
      if (!contentText && !children) return null;
      
      return (
        <div className="mb-6">
          {contentText && (
            <p
              {...ContentTextProps}
              className={cn(
                'text-muted-foreground leading-relaxed',
                contentStyle,
                ContentTextProps.className
              )}
            >
              {contentText}
            </p>
          )}
          {children}
        </div>
      );
    };

    const renderButton = () => {
      if (!buttonText || !buttonOnPress) return null;
      
      return (
        <Button
          preset={buttonPreset}
          onClick={buttonOnPress}
          className={buttonStyle}
        >
          {buttonText}
        </Button>
      );
    };

    return (
      <div
        ref={ref}
        className={cn(emptyStateVariants({ preset, size, className }))}
        {...props}
      >
        {renderImage()}
        {renderHeading()}
        {renderContent()}
        {renderButton()}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';

export { EmptyState, emptyStateVariants };