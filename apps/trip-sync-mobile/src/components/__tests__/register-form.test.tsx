import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

import { RegisterForm } from '../register-form';

// Mock the UI components
jest.mock('@/components/ui', () => ({
  Button: ({ onPress, label, disabled, testID, ...props }: any) => {
    const { TouchableOpacity, Text } = require('react-native');
    return (
      <TouchableOpacity 
        onPress={onPress} 
        disabled={disabled} 
        testID={testID || 'button'}
        {...props}
      >
        <Text>{label}</Text>
      </TouchableOpacity>
    );
  },
  Checkbox: ({ onChange, checked }: any) => {
    const { TouchableOpacity, Text } = require('react-native');
    return (
      <TouchableOpacity onPress={() => onChange(!checked)} testID="checkbox">
        <Text>{checked ? 'checked' : 'unchecked'}</Text>
      </TouchableOpacity>
    );
  },
  ControlledInput: ({ name, control, ...props }: any) => {
    const { TextInput } = require('react-native');
    const { useController } = require('react-hook-form');
    const { field } = useController({ name, control });
    return (
      <TextInput
        {...props}
        value={field.value}
        onChangeText={field.onChange}
        testID={props.testID}
      />
    );
  },
  Text: ({ children }: any) => {
    const { Text: RNText } = require('react-native');
    return <RNText>{children}</RNText>;
  },
  View: ({ children }: any) => {
    const { View: RNView } = require('react-native');
    return <RNView>{children}</RNView>;
  },
}));

describe('RegisterForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields', () => {
    const { getByTestId } = render(<RegisterForm onSubmit={mockOnSubmit} />);

    expect(getByTestId('name-input')).toBeTruthy();
    expect(getByTestId('email-input')).toBeTruthy();
    expect(getByTestId('password-input')).toBeTruthy();
    expect(getByTestId('confirm-password-input')).toBeTruthy();
    expect(getByTestId('checkbox')).toBeTruthy();
    expect(getByTestId('register-button')).toBeTruthy();
  });

  it('submits form with valid data', async () => {
    const { getByTestId } = render(<RegisterForm onSubmit={mockOnSubmit} />);

    fireEvent.changeText(getByTestId('name-input'), 'John Doe');
    fireEvent.changeText(getByTestId('email-input'), 'john@example.com');
    fireEvent.changeText(getByTestId('password-input'), 'Pass123!@#');
    fireEvent.changeText(getByTestId('confirm-password-input'), 'Pass123!@#');
    fireEvent.press(getByTestId('checkbox')); // Check terms

    fireEvent.press(getByTestId('register-button'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          fullName: 'John Doe',
          email: 'john@example.com',
          password: 'Pass123!@#',
          confirmPassword: 'Pass123!@#',
          agreeToTerms: true,
        })
      );
    });
  });

  it('disables submit button when terms not agreed', () => {
    const { getByTestId } = render(<RegisterForm onSubmit={mockOnSubmit} />);
    
    const button = getByTestId('register-button');
    expect(button.props.disabled).toBe(true);
  });

  it('enables submit button when terms agreed', () => {
    const { getByTestId } = render(<RegisterForm onSubmit={mockOnSubmit} />);
    
    fireEvent.press(getByTestId('checkbox')); // Check terms
    
    const button = getByTestId('register-button');
    expect(button.props.disabled).toBe(false);
  });

  it('shows loading state when submitting', () => {
    const { getByTestId, getByText } = render(
      <RegisterForm onSubmit={mockOnSubmit} isLoading={true} />
    );
    
    expect(getByText('Creating Account...')).toBeTruthy();
    expect(getByTestId('register-button').props.disabled).toBe(true);
  });

  it('validates password requirements', async () => {
    const { getByTestId } = render(<RegisterForm onSubmit={mockOnSubmit} />);

    // Fill in valid data except password
    fireEvent.changeText(getByTestId('name-input'), 'John Doe');
    fireEvent.changeText(getByTestId('email-input'), 'john@example.com');
    fireEvent.changeText(getByTestId('password-input'), 'weak'); // Too short
    fireEvent.changeText(getByTestId('confirm-password-input'), 'weak');
    fireEvent.press(getByTestId('checkbox')); // Check terms

    fireEvent.press(getByTestId('register-button'));

    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it('validates password confirmation match', async () => {
    const { getByTestId } = render(<RegisterForm onSubmit={mockOnSubmit} />);

    fireEvent.changeText(getByTestId('name-input'), 'John Doe');
    fireEvent.changeText(getByTestId('email-input'), 'john@example.com');
    fireEvent.changeText(getByTestId('password-input'), 'Pass123!@#');
    fireEvent.changeText(getByTestId('confirm-password-input'), 'Different123!@#');
    fireEvent.press(getByTestId('checkbox')); // Check terms

    fireEvent.press(getByTestId('register-button'));

    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });
});