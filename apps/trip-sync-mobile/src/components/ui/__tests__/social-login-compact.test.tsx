import { render, screen } from '@testing-library/react-native';
import React from 'react';

import { SocialLoginCompact } from '../social-login-compact';

describe('SocialLoginCompact', () => {
  it('renders both Google and Apple buttons', () => {
    render(<SocialLoginCompact />);

    expect(screen.getByTestId('compact-google-button')).toBeTruthy();
    expect(screen.getByTestId('compact-apple-button')).toBeTruthy();
  });

  it('applies custom testID correctly', () => {
    render(<SocialLoginCompact testID="custom-social" />);

    expect(screen.getByTestId('custom-social')).toBeTruthy();
    expect(screen.getByTestId('custom-social-google')).toBeTruthy();
    expect(screen.getByTestId('custom-social-apple')).toBeTruthy();
  });

  it('handles loading states independently', () => {
    render(
      <SocialLoginCompact
        loading={{ google: true, apple: false }}
        testID="loading-test"
      />
    );

    // Google button should show loading
    expect(screen.getByTestId('loading-test-google-loading')).toBeTruthy();

    // Apple button should not show loading
    expect(screen.queryByTestId('loading-test-apple-loading')).toBeNull();
  });

  it('disables all buttons when disabled prop is true', () => {
    render(<SocialLoginCompact disabled={true} testID="disabled-test" />);

    const googleButton = screen.getByTestId('disabled-test-google');
    const appleButton = screen.getByTestId('disabled-test-apple');

    expect(googleButton).toHaveAccessibilityState({ disabled: true });
    expect(appleButton).toHaveAccessibilityState({ disabled: true });
  });

  it('disables all buttons when any is loading', () => {
    render(
      <SocialLoginCompact
        loading={{ google: false, apple: true }}
        testID="any-loading-test"
      />
    );

    const googleButton = screen.getByTestId('any-loading-test-google');
    const appleButton = screen.getByTestId('any-loading-test-apple');

    // Both buttons should be disabled when any is loading
    expect(googleButton).toHaveAccessibilityState({ disabled: true });
    expect(appleButton).toHaveAccessibilityState({
      disabled: true,
      busy: true,
    });
  });

  it('maintains proper accessibility labels for minimal buttons', () => {
    render(<SocialLoginCompact testID="a11y-test" />);

    const googleButton = screen.getByTestId('a11y-test-google');
    const appleButton = screen.getByTestId('a11y-test-apple');

    expect(googleButton).toHaveAccessibilityLabel('Sign in with Google');
    expect(appleButton).toHaveAccessibilityLabel('Sign in with Apple');
  });

  it('calls correct handlers when pressed', () => {
    const onGooglePress = jest.fn();
    const onApplePress = jest.fn();

    render(
      <SocialLoginCompact
        onGooglePress={onGooglePress}
        onApplePress={onApplePress}
        testID="press-test"
      />
    );

    const googleButton = screen.getByTestId('press-test-google');
    const appleButton = screen.getByTestId('press-test-apple');

    googleButton.props.onPress();
    appleButton.props.onPress();

    expect(onGooglePress).toHaveBeenCalledTimes(1);
    expect(onApplePress).toHaveBeenCalledTimes(1);
  });
});
