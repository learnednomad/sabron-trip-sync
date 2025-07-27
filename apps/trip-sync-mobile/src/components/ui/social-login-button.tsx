import * as Haptics from 'expo-haptics';
import React from 'react';
import type { PressableProps } from 'react-native';
import {
  ActivityIndicator,
  Pressable,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

import { AppleIcon, GoogleIcon } from './icons';

type SocialProvider = 'google' | 'apple';

const socialButton = tv({
  slots: {
    container:
      'flex-row items-center justify-center rounded-2xl border-2 shadow-sm transition-all duration-150',
    content: 'flex-row items-center justify-center',
    label: 'font-inter font-semibold',
    icon: 'flex-shrink-0',
    indicator: 'flex-shrink-0',
  },
  variants: {
    provider: {
      google: {
        container:
          'border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:focus:border-blue-400 dark:focus:ring-blue-400',
        label: 'text-gray-700 dark:text-gray-200',
      },
      apple: {
        container:
          'border-black bg-black focus:border-gray-500 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-white dark:bg-white dark:focus:border-gray-300 dark:focus:ring-gray-300',
        label: 'text-white dark:text-black',
      },
    },
    variant: {
      default: {
        container: 'h-14 px-6',
        content: 'gap-3',
        label: 'text-base',
      },
      minimal: {
        container: 'size-12 p-0',
        content: 'gap-0',
        label: 'sr-only',
      },
    },
    disabled: {
      true: {
        container: 'cursor-not-allowed opacity-50',
        label: 'opacity-50',
      },
    },
    pressed: {
      true: {
        container: 'scale-[0.97] opacity-90 shadow-md',
      },
    },
    focused: {
      true: {
        container: 'ring-2 ring-offset-2',
      },
    },
  },
  defaultVariants: {
    provider: 'google',
    variant: 'default',
    disabled: false,
    pressed: false,
    focused: false,
  },
});

type SocialButtonVariants = VariantProps<typeof socialButton>;

interface SocialLoginButtonProps
  extends SocialButtonVariants,
    Omit<PressableProps, 'disabled'> {
  provider: SocialProvider;
  variant?: 'default' | 'minimal';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  testID?: string;
}

const providerConfig = {
  google: {
    label: 'Continue with Google',
    icon: GoogleIcon,
    accessibilityLabel: 'Sign in with Google',
    accessibilityHint: 'Opens Google sign-in flow in your browser',
  },
  apple: {
    label: 'Continue with Apple',
    icon: AppleIcon,
    accessibilityLabel: 'Sign in with Apple',
    accessibilityHint: 'Opens Apple sign-in flow',
  },
} as const;

export const SocialLoginButton = React.forwardRef<View, SocialLoginButtonProps>(
  (
    {
      provider,
      loading = false,
      disabled = false,
      className = '',
      testID,
      onPress,
      ...props
    },
    ref
  ) => {
    const colorScheme = useColorScheme();
    const [pressed, setPressed] = React.useState(false);
    const [focused, setFocused] = React.useState(false);

    const config = providerConfig[provider];
    const IconComponent = config.icon;
    const isDisabled = disabled || loading;

    const styles = React.useMemo(
      () =>
        socialButton({
          provider,
          variant: props.variant,
          disabled: isDisabled,
          pressed,
          focused,
        }),
      [provider, props.variant, isDisabled, pressed, focused]
    );

    // Apple icon should be white on black background, black on white background
    const appleIconColor = React.useMemo(() => {
      if (provider !== 'apple') return undefined;
      return colorScheme === 'dark' ? '#000000' : '#FFFFFF';
    }, [provider, colorScheme]);

    const handlePressIn = React.useCallback(async () => {
      if (!isDisabled) {
        setPressed(true);
        // Light haptic feedback on press
        try {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch (error) {
          // Haptics may not be available on all devices
          console.debug('Haptics not available:', error);
        }
      }
    }, [isDisabled]);

    const handlePressOut = React.useCallback(() => {
      setPressed(false);
    }, []);

    const handleFocus = React.useCallback(() => {
      setFocused(true);
    }, []);

    const handleBlur = React.useCallback(() => {
      setFocused(false);
    }, []);

    const handlePress = React.useCallback(
      async (event: any) => {
        if (!isDisabled && onPress) {
          // Medium haptic feedback on successful press
          try {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          } catch (error) {
            console.debug('Haptics not available:', error);
          }
          onPress(event);
        }
      },
      [isDisabled, onPress]
    );

    return (
      <Pressable
        ref={ref}
        disabled={isDisabled}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={styles.container({ className })}
        testID={testID}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={config.accessibilityLabel}
        accessibilityHint={
          loading ? 'Loading, please wait' : config.accessibilityHint
        }
        accessibilityState={{
          disabled: isDisabled,
          busy: loading,
          selected: focused,
        }}
        {...props}
      >
        <View className={styles.content()}>
          {loading ? (
            <ActivityIndicator
              size="small"
              color={provider === 'apple' ? appleIconColor : '#4285F4'}
              className={styles.indicator()}
              testID={testID ? `${testID}-loading` : undefined}
            />
          ) : (
            <View className={styles.icon()}>
              <IconComponent
                size={props.variant === 'minimal' ? 16 : 20}
                {...(provider === 'apple' && { color: appleIconColor })}
              />
            </View>
          )}
          <Text
            className={styles.label()}
            testID={testID ? `${testID}-label` : undefined}
          >
            {props.variant === 'minimal'
              ? provider === 'apple'
                ? 'Apple'
                : 'Google'
              : loading
                ? `Connecting to ${provider === 'apple' ? 'Apple' : 'Google'}...`
                : config.label}
          </Text>
        </View>
      </Pressable>
    );
  }
);

SocialLoginButton.displayName = 'SocialLoginButton';
