import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

import { SocialLoginButton } from '../social-login-button';

describe('SocialLoginButton', () => {
  it('renders Google button correctly', () => {
    const mockOnPress = jest.fn();

    render(
      <SocialLoginButton
        provider="google"
        onPress={mockOnPress}
        testID="google-button"
      />
    );

    const button = screen.getByTestId('google-button');
    const label = screen.getByTestId('google-button-label');

    expect(button).toBeTruthy();
    expect(label).toHaveTextContent('Continue with Google');
    expect(button).toHaveAccessibilityLabel('Sign in with Google');
  });

  it('renders Apple button correctly', () => {
    const mockOnPress = jest.fn();

    render(
      <SocialLoginButton
        provider="apple"
        onPress={mockOnPress}
        testID="apple-button"
      />
    );

    const button = screen.getByTestId('apple-button');
    const label = screen.getByTestId('apple-button-label');

    expect(button).toBeTruthy();
    expect(label).toHaveTextContent('Continue with Apple');
    expect(button).toHaveAccessibilityLabel('Sign in with Apple');
  });

  it('shows loading state correctly', () => {
    const mockOnPress = jest.fn();

    render(
      <SocialLoginButton
        provider="google"
        loading={true}
        onPress={mockOnPress}
        testID="loading-button"
      />
    );

    const button = screen.getByTestId('loading-button');
    const label = screen.getByTestId('loading-button-label');
    const loading = screen.getByTestId('loading-button-loading');

    expect(button).toBeTruthy();
    expect(label).toHaveTextContent('Connecting to Google...');
    expect(loading).toBeTruthy();
    expect(button).toHaveAccessibilityHint('Loading, please wait');
  });

  it('handles press events correctly', () => {
    const mockOnPress = jest.fn();

    render(
      <SocialLoginButton
        provider="google"
        onPress={mockOnPress}
        testID="press-button"
      />
    );

    const button = screen.getByTestId('press-button');
    fireEvent.press(button);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('prevents press when disabled', () => {
    const mockOnPress = jest.fn();

    render(
      <SocialLoginButton
        provider="google"
        disabled={true}
        onPress={mockOnPress}
        testID="disabled-button"
      />
    );

    const button = screen.getByTestId('disabled-button');
    fireEvent.press(button);

    expect(mockOnPress).not.toHaveBeenCalled();
    expect(button).toHaveAccessibilityState({ disabled: true });
  });

  it('prevents press when loading', () => {
    const mockOnPress = jest.fn();

    render(
      <SocialLoginButton
        provider="apple"
        loading={true}
        onPress={mockOnPress}
        testID="loading-disabled-button"
      />
    );

    const button = screen.getByTestId('loading-disabled-button');
    fireEvent.press(button);

    expect(mockOnPress).not.toHaveBeenCalled();
    expect(button).toHaveAccessibilityState({ disabled: true, busy: true });
  });
});
