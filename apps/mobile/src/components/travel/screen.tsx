import * as React from 'react';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from '@/components/ui';

const screenVariants = cva(
  'flex-1',
  {
    variants: {
      preset: {
        scroll: 'flex-1',
        fixed: 'flex-1',
        travel: 'flex-1 bg-gradient-to-b from-blue-50 to-purple-50',
        fullscreen: 'flex-1',
      },
      padding: {
        none: '',
        small: 'p-2',
        default: 'p-4',
        large: 'p-6',
      },
      safeAreaEdges: {
        all: '',
        top: '',
        bottom: '',
        horizontal: '',
        none: '',
      },
    },
    defaultVariants: {
      preset: 'scroll',
      padding: 'default',
      safeAreaEdges: 'all',
    },
  }
);

export interface ScreenProps
  extends VariantProps<typeof screenVariants> {
  children: React.ReactNode;
  className?: string;
  
  // Keyboard handling
  keyboardAvoidingView?: boolean;
  keyboardBehavior?: 'padding' | 'height' | 'position';
  keyboardOffset?: number;
  
  // Scroll behavior
  scrollEnabled?: boolean;
  refreshControl?: React.ReactElement;
  onScroll?: (event: any) => void;
  
  // Safe area customization
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  
  // Style overrides
  contentContainerStyle?: any;
  scrollViewProps?: any;
}

export const Screen: React.FC<ScreenProps> = ({
  preset,
  padding,
  safeAreaEdges,
  children,
  className,
  keyboardAvoidingView = true,
  keyboardBehavior = 'padding',
  keyboardOffset = 0,
  scrollEnabled = true,
  refreshControl,
  onScroll,
  edges,
  contentContainerStyle,
  scrollViewProps,
}) => {
  // Determine safe area edges based on preset
  const getSafeAreaEdges = (): ('top' | 'bottom' | 'left' | 'right')[] => {
    if (edges) return edges;
    
    switch (safeAreaEdges) {
      case 'all':
        return ['top', 'bottom', 'left', 'right'];
      case 'top':
        return ['top'];
      case 'bottom':
        return ['bottom'];
      case 'horizontal':
        return ['left', 'right'];
      case 'none':
        return [];
      default:
        return ['top', 'bottom', 'left', 'right'];
    }
  };
  
  const renderContent = () => {
    const content = (
      <View className={screenVariants({ preset, padding, className })}>
        {children}
      </View>
    );
    
    if (preset === 'fixed') {
      return content;
    }
    
    return (
      <ScrollView
        className="flex-1"
        contentContainerStyle={[
          { flexGrow: 1 },
          contentContainerStyle,
        ]}
        scrollEnabled={scrollEnabled}
        refreshControl={refreshControl}
        onScroll={onScroll}
        showsVerticalScrollIndicator={false}
        {...scrollViewProps}
      >
        {content}
      </ScrollView>
    );
  };
  
  const renderWithKeyboardAvoidance = () => {
    if (!keyboardAvoidingView) {
      return renderContent();
    }
    
    return (
      <KeyboardAvoidingView
        className="flex-1"
        behavior={keyboardBehavior}
        keyboardVerticalOffset={keyboardOffset}
        enabled={Platform.OS === 'ios'}
      >
        {renderContent()}
      </KeyboardAvoidingView>
    );
  };

  return (
    <SafeAreaView className="flex-1" edges={getSafeAreaEdges()}>
      {renderWithKeyboardAvoidance()}
    </SafeAreaView>
  );
};