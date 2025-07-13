import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const screenVariants = cva(
  'flex flex-col min-h-screen',
  {
    variants: {
      preset: {
        scroll: 'overflow-y-auto',
        fixed: 'overflow-hidden',
        auto: 'overflow-auto',
        travel: 'bg-gradient-to-b from-blue-50 to-purple-50',
      },
      safeArea: {
        none: '',
        top: 'pt-safe-top',
        bottom: 'pb-safe-bottom',
        both: 'pt-safe-top pb-safe-bottom',
        all: 'p-safe',
      },
      padding: {
        none: '',
        small: 'p-4',
        medium: 'p-6',
        large: 'p-8',
      },
      keyboardOffset: {
        none: '',
        auto: 'pb-keyboard',
      },
    },
    defaultVariants: {
      preset: 'auto',
      safeArea: 'both',
      padding: 'medium',
      keyboardOffset: 'none',
    },
  }
);

const scrollViewVariants = cva(
  'flex-1',
  {
    variants: {
      contentContainerStyle: {
        default: '',
        centered: 'justify-center items-center',
        spaceBetween: 'justify-between',
      },
    },
    defaultVariants: {
      contentContainerStyle: 'default',
    },
  }
);

export interface ScreenProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof screenVariants> {
  children?: React.ReactNode;
  
  // Header props
  header?: React.ReactNode;
  
  // Footer props  
  footer?: React.ReactNode;
  
  // Scroll behavior
  contentContainerStyle?: 'default' | 'centered' | 'spaceBetween';
  
  // Safe area edges (for mobile)
  safeAreaEdges?: Array<'top' | 'bottom' | 'left' | 'right'>;
  
  // Keyboard handling
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
  
  // Background
  backgroundColor?: string;
  
  // Status bar (mobile)
  statusBarStyle?: 'default' | 'light-content' | 'dark-content';
  
  // Loading state
  loading?: boolean;
  loadingComponent?: React.ReactNode;
  
  // Error state
  error?: boolean;
  errorComponent?: React.ReactNode;
}

const Screen = React.forwardRef<HTMLDivElement, ScreenProps>(
  ({
    className,
    preset,
    safeArea,
    padding,
    keyboardOffset,
    children,
    header,
    footer,
    contentContainerStyle = 'default',
    backgroundColor,
    loading,
    loadingComponent,
    error,
    errorComponent,
    style,
    ...props
  }, ref) => {
    
    const renderContent = () => {
      if (loading && loadingComponent) {
        return loadingComponent;
      }
      
      if (error && errorComponent) {
        return errorComponent;
      }
      
      return children;
    };
    
    const renderScrollableContent = () => {
      if (preset === 'scroll') {
        return (
          <div className={cn(scrollViewVariants({ contentContainerStyle }))}>
            {renderContent()}
          </div>
        );
      }
      
      return renderContent();
    };

    return (
      <div
        ref={ref}
        className={cn(screenVariants({ preset, safeArea, padding, keyboardOffset, className }))}
        style={{
          backgroundColor,
          ...style,
        }}
        {...props}
      >
        {header}
        
        <main className="flex-1 flex flex-col">
          {renderScrollableContent()}
        </main>
        
        {footer}
      </div>
    );
  }
);

Screen.displayName = 'Screen';

// Default loading component
const DefaultLoadingComponent = () => (
  <div className="flex-1 flex items-center justify-center">
    <div className="flex items-center space-x-2">
      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-muted-foreground">Loading...</span>
    </div>
  </div>
);

// Default error component
const DefaultErrorComponent = ({ 
  title = "Something went wrong", 
  message = "Please try again later",
  onRetry 
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) => (
  <div className="flex-1 flex flex-col items-center justify-center space-y-4 p-6">
    <div className="text-center space-y-2">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="text-muted-foreground">{message}</p>
    </div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        Try Again
      </button>
    )}
  </div>
);

export { Screen, screenVariants, DefaultLoadingComponent, DefaultErrorComponent };