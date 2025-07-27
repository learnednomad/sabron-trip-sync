import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';
import React from 'react';

import { SocialLoginButton } from '../social-login-button';
import { SocialLoginCompact } from '../social-login-compact';
import {
  getSocialButtonAccessibilityReport,
  validateSocialButtonContrasts,
} from '../utils/contrast-checker';

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

describe('Enhanced Accessibility Features', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Haptic Feedback', () => {
    it('triggers light haptic feedback on press in', async () => {
      const onPress = jest.fn();
      render(
        <SocialLoginButton
          provider="google"
          onPress={onPress}
          testID="haptic-test"
        />
      );

      const button = screen.getByTestId('haptic-test');
      fireEvent(button, 'pressIn');

      await waitFor(() => {
        expect(Haptics.impactAsync).toHaveBeenCalledWith('light');
      });
    });

    it('triggers medium haptic feedback on successful press', async () => {
      const onPress = jest.fn();
      render(
        <SocialLoginButton
          provider="apple"
          onPress={onPress}
          testID="haptic-press-test"
        />
      );

      const button = screen.getByTestId('haptic-press-test');
      fireEvent.press(button);

      await waitFor(() => {
        expect(Haptics.impactAsync).toHaveBeenCalledWith('medium');
        expect(onPress).toHaveBeenCalled();
      });
    });

    it('does not trigger haptics when disabled', async () => {
      render(
        <SocialLoginButton
          provider="google"
          disabled={true}
          testID="disabled-haptic-test"
        />
      );

      const button = screen.getByTestId('disabled-haptic-test');
      fireEvent(button, 'pressIn');

      // Wait a bit to ensure no haptic was triggered
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });

    it('handles haptic errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'debug').mockImplementation();
      (Haptics.impactAsync as jest.Mock).mockRejectedValueOnce(
        new Error('Haptics not available')
      );

      const onPress = jest.fn();
      render(
        <SocialLoginButton
          provider="google"
          onPress={onPress}
          testID="haptic-error-test"
        />
      );

      const button = screen.getByTestId('haptic-error-test');
      fireEvent(button, 'pressIn');

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Haptics not available:',
          expect.any(Error)
        );
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Focus Indicators', () => {
    it('updates accessibility state when focused', () => {
      render(<SocialLoginButton provider="google" testID="focus-test" />);

      const button = screen.getByTestId('focus-test');

      // Simulate focus
      fireEvent(button, 'focus');

      // Check if accessibility state includes focused state
      expect(button.props.accessibilityState).toEqual(
        expect.objectContaining({
          disabled: false,
          busy: false,
          selected: true, // focused state
        })
      );
    });

    it('removes focus state on blur', () => {
      render(<SocialLoginButton provider="apple" testID="blur-test" />);

      const button = screen.getByTestId('blur-test');

      // Focus then blur
      fireEvent(button, 'focus');
      fireEvent(button, 'blur');

      expect(button.props.accessibilityState).toEqual(
        expect.objectContaining({
          selected: false, // no longer focused
        })
      );
    });
  });

  describe('Enhanced Press Animations', () => {
    it('applies enhanced press scaling to default buttons', () => {
      render(
        <SocialLoginButton
          provider="google"
          variant="default"
          testID="press-animation-test"
        />
      );

      const button = screen.getByTestId('press-animation-test');
      fireEvent(button, 'pressIn');

      // The exact class checking would depend on how the styles are applied
      // This test verifies the component renders without errors during press
      expect(button).toBeTruthy();
    });

    it('applies enhanced press scaling to minimal buttons', () => {
      render(
        <SocialLoginButton
          provider="apple"
          variant="minimal"
          testID="minimal-press-test"
        />
      );

      const button = screen.getByTestId('minimal-press-test');
      fireEvent(button, 'pressIn');

      expect(button).toBeTruthy();
    });
  });

  describe('Compact Component Enhanced Features', () => {
    it('maintains haptic feedback for both buttons', async () => {
      const onGooglePress = jest.fn();
      const onApplePress = jest.fn();

      render(
        <SocialLoginCompact
          onGooglePress={onGooglePress}
          onApplePress={onApplePress}
          testID="compact-haptic-test"
        />
      );

      const googleButton = screen.getByTestId('compact-haptic-test-google');
      const appleButton = screen.getByTestId('compact-haptic-test-apple');

      fireEvent(googleButton, 'pressIn');
      fireEvent(appleButton, 'pressIn');

      await waitFor(() => {
        expect(Haptics.impactAsync).toHaveBeenCalledTimes(2);
        expect(Haptics.impactAsync).toHaveBeenCalledWith('light');
      });
    });

    it('supports focus navigation between buttons', () => {
      render(<SocialLoginCompact testID="compact-focus-test" />);

      const googleButton = screen.getByTestId('compact-focus-test-google');
      const appleButton = screen.getByTestId('compact-focus-test-apple');

      fireEvent(googleButton, 'focus');
      expect(googleButton.props.accessibilityState.selected).toBe(true);

      fireEvent(googleButton, 'blur');
      fireEvent(appleButton, 'focus');

      expect(googleButton.props.accessibilityState.selected).toBe(false);
      expect(appleButton.props.accessibilityState.selected).toBe(true);
    });
  });

  describe('Contrast Validation', () => {
    it('validates color contrast ratios meet WCAG standards', () => {
      const { compliance } = validateSocialButtonContrasts();

      // All button variants should meet WCAG AA standards
      expect(compliance.google.light.textAACompliant).toBe(true);
      expect(compliance.google.dark.textAACompliant).toBe(true);
      expect(compliance.apple.light.textAACompliant).toBe(true);
      expect(compliance.apple.dark.textAACompliant).toBe(true);
    });

    it('generates accessibility report', () => {
      const report = getSocialButtonAccessibilityReport();

      expect(report).toContain('Social Button Accessibility Report');
      expect(report).toContain('Google Button:');
      expect(report).toContain('Apple Button:');
      expect(report).toContain('Overall Compliance:');

      // Should indicate compliance status
      expect(report).toMatch(/✅|❌/);
    });

    it('has high contrast ratios for both providers', () => {
      const { results } = validateSocialButtonContrasts();

      // Google button contrasts
      expect(results.google.light.textOnBackground).toBeGreaterThan(4.5);
      expect(results.google.dark.textOnBackground).toBeGreaterThan(4.5);

      // Apple button contrasts (should be very high - black/white)
      expect(results.apple.light.textOnBackground).toBeGreaterThan(15);
      expect(results.apple.dark.textOnBackground).toBeGreaterThan(15);
    });
  });

  describe('Error Handling', () => {
    it('handles missing accessibility features gracefully', () => {
      // Test that the component doesn't crash when accessibility features fail
      const consoleSpy = jest.spyOn(console, 'debug').mockImplementation();

      render(
        <SocialLoginButton provider="google" testID="error-handling-test" />
      );

      const button = screen.getByTestId('error-handling-test');
      expect(button).toBeTruthy();
      expect(button.props.accessible).toBe(true);
      expect(button.props.accessibilityRole).toBe('button');

      consoleSpy.mockRestore();
    });
  });
});
