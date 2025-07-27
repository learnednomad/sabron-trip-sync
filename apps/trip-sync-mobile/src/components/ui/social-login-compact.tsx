import React from 'react';
import { View } from 'react-native';

import { SocialLoginButton } from './social-login-button';

interface SocialLoginCompactProps {
  loading?: {
    google: boolean;
    apple: boolean;
  };
  disabled?: boolean;
  onGooglePress?: () => void;
  onApplePress?: () => void;
  testID?: string;
}

export const SocialLoginCompact = ({
  loading = { google: false, apple: false },
  disabled = false,
  onGooglePress,
  onApplePress,
  testID,
}: SocialLoginCompactProps) => {
  const isAnyLoading = loading.google || loading.apple;

  return (
    <View className="flex-row justify-center gap-4" testID={testID}>
      <SocialLoginButton
        provider="google"
        variant="minimal"
        loading={loading.google}
        disabled={disabled || isAnyLoading}
        onPress={onGooglePress}
        testID={testID ? `${testID}-google` : 'compact-google-button'}
      />
      <SocialLoginButton
        provider="apple"
        variant="minimal"
        loading={loading.apple}
        disabled={disabled || isAnyLoading}
        onPress={onApplePress}
        testID={testID ? `${testID}-apple` : 'compact-apple-button'}
      />
    </View>
  );
};
