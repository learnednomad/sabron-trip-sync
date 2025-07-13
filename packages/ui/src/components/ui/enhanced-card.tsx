import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';

const cardVariants = cva(
  'rounded-lg border bg-card text-card-foreground shadow-sm',
  {
    variants: {
      preset: {
        default: 'bg-white border-gray-200',
        reversed: 'bg-gray-900 text-white border-gray-700',
        elevated: 'shadow-lg border-0',
        flat: 'shadow-none border-2',
        travel: 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200',
      },
      verticalAlignment: {
        top: 'justify-start',
        center: 'justify-center',
        bottom: 'justify-end',
        'space-between': 'justify-between',
        'space-around': 'justify-around',
      },
      size: {
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      preset: 'default',
      verticalAlignment: 'top',
      size: 'default',
    },
  }
);

const cardContentVariants = cva('flex flex-col', {
  variants: {
    verticalAlignment: {
      top: 'justify-start',
      center: 'justify-center',
      bottom: 'justify-end',
      'space-between': 'justify-between',
      'space-around': 'justify-around',
    },
  },
});

export interface EnhancedCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
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
  
  footer?: string;
  footerTx?: string;
  footerTxOptions?: Record<string, any>;
  footerStyle?: string;
  FooterTextProps?: React.HTMLAttributes<HTMLDivElement>;
  
  LeftComponent?: React.ReactNode;
  RightComponent?: React.ReactNode;
}

const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({
    className,
    preset,
    verticalAlignment,
    size,
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
    footer,
    footerTx,
    footerTxOptions,
    footerStyle,
    FooterTextProps = {},
    LeftComponent,
    RightComponent,
    children,
    ...props
  }, ref) => {
    const { t } = useTranslation();

    const headingText = headingTx ? t(headingTx, headingTxOptions) : heading;
    const contentText = contentTx ? t(contentTx, contentTxOptions) : content;
    const footerText = footerTx ? t(footerTx, footerTxOptions) : footer;

    const renderHeader = () => {
      if (!headingText && !LeftComponent && !RightComponent) return null;
      
      return (
        <div className="flex items-center justify-between mb-4">
          {LeftComponent && <div className="flex-shrink-0">{LeftComponent}</div>}
          {headingText && (
            <h3
              {...HeadingTextProps}
              className={cn(
                'text-lg font-semibold leading-none tracking-tight',
                headingStyle,
                HeadingTextProps.className
              )}
            >
              {headingText}
            </h3>
          )}
          {RightComponent && <div className="flex-shrink-0">{RightComponent}</div>}
        </div>
      );
    };

    const renderContent = () => {
      if (!contentText && !children) return null;
      
      return (
        <div className="flex-1">
          {contentText && (
            <p
              {...ContentTextProps}
              className={cn(
                'text-sm text-muted-foreground',
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

    const renderFooter = () => {
      if (!footerText) return null;
      
      return (
        <div
          {...FooterTextProps}
          className={cn(
            'text-xs text-muted-foreground mt-4 pt-4 border-t',
            footerStyle,
            FooterTextProps.className
          )}
        >
          {footerText}
        </div>
      );
    };

    return (
      <div
        ref={ref}
        className={cn(cardVariants({ preset, verticalAlignment, size, className }))}
        {...props}
      >
        <div className={cn(cardContentVariants({ verticalAlignment }))}>
          {renderHeader()}
          {renderContent()}
          {renderFooter()}
        </div>
      </div>
    );
  }
);

EnhancedCard.displayName = 'EnhancedCard';

export { EnhancedCard, cardVariants };