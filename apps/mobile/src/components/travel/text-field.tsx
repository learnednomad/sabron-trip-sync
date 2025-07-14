import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput, View } from 'react-native';

import { Text } from '@/components/ui';

const textFieldVariants = cva('w-full', {
  variants: {
    preset: {
      default: '',
      travel: '',
      filled: '',
      outlined: '',
    },
    size: {
      small: '',
      default: '',
      large: '',
    },
    status: {
      default: '',
      error: '',
      success: '',
      warning: '',
    },
  },
  defaultVariants: {
    preset: 'default',
    size: 'default',
    status: 'default',
  },
});

const inputVariants = cva('rounded-lg border px-4 py-3 text-base', {
  variants: {
    preset: {
      default: 'border-border bg-background',
      travel: 'border-blue-200 bg-blue-50/30 focus:border-blue-500',
      filled: 'bg-muted border-transparent',
      outlined: 'border-border bg-transparent',
    },
    size: {
      small: 'px-3 py-2 text-sm',
      default: 'px-4 py-3 text-base',
      large: 'px-5 py-4 text-lg',
    },
    status: {
      default: '',
      error: 'border-red-500 bg-red-50/30',
      success: 'border-green-500 bg-green-50/30',
      warning: 'border-yellow-500 bg-yellow-50/30',
    },
  },
  defaultVariants: {
    preset: 'default',
    size: 'default',
    status: 'default',
  },
});

export interface TextFieldProps extends VariantProps<typeof textFieldVariants> {
  // Labels
  title?: string;
  titleTx?: string;
  titleTxOptions?: Record<string, any>;

  placeholder?: string;
  placeholderTx?: string;
  placeholderTxOptions?: Record<string, any>;

  helper?: string;
  helperTx?: string;
  helperTxOptions?: Record<string, any>;

  // Input props
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?:
    | 'default'
    | 'email-address'
    | 'numeric'
    | 'phone-pad'
    | 'number-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  editable?: boolean;

  // Styling
  className?: string;
  inputClassName?: string;

  // State
  disabled?: boolean;
  required?: boolean;

  // Icons/Components
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;

  // Validation
  error?: string;
  errorTx?: string;
  errorTxOptions?: Record<string, any>;

  // Events
  onFocus?: () => void;
  onBlur?: () => void;
  onSubmitEditing?: () => void;
}

export const TextField: React.FC<TextFieldProps> = ({
  preset,
  size,
  status,
  title,
  titleTx,
  titleTxOptions,
  placeholder,
  placeholderTx,
  placeholderTxOptions,
  helper,
  helperTx,
  helperTxOptions,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  editable = true,
  className,
  inputClassName,
  disabled = false,
  required = false,
  leftComponent,
  rightComponent,
  error,
  errorTx,
  errorTxOptions,
  onFocus,
  onBlur,
  onSubmitEditing,
}) => {
  const { t } = useTranslation();

  const titleText = titleTx ? t(titleTx, titleTxOptions) : title;
  const placeholderText = placeholderTx
    ? t(placeholderTx, placeholderTxOptions)
    : placeholder;
  const helperText = helperTx ? t(helperTx, helperTxOptions) : helper;
  const errorText = errorTx ? t(errorTx, errorTxOptions) : error;

  const currentStatus = errorText ? 'error' : status;

  const renderTitle = () => {
    if (!titleText) return null;

    return (
      <Text className="text-foreground mb-2 font-medium">
        {titleText}
        {required && <Text className="ml-1 text-red-500">*</Text>}
      </Text>
    );
  };

  const renderInput = () => (
    <View className="relative">
      {leftComponent && (
        <View className="absolute left-3 top-1/2 z-10 -translate-y-1/2">
          {leftComponent}
        </View>
      )}

      <TextInput
        className={inputVariants({
          preset,
          size,
          status: currentStatus,
          className: `${leftComponent ? 'pl-12' : ''} ${rightComponent ? 'pr-12' : ''} ${inputClassName}`,
        })}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholderText}
        placeholderTextColor="#9CA3AF"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : 1}
        maxLength={maxLength}
        editable={editable && !disabled}
        onFocus={onFocus}
        onBlur={onBlur}
        onSubmitEditing={onSubmitEditing}
        textAlignVertical={multiline ? 'top' : 'center'}
      />

      {rightComponent && (
        <View className="absolute right-3 top-1/2 z-10 -translate-y-1/2">
          {rightComponent}
        </View>
      )}
    </View>
  );

  const renderHelper = () => {
    if (!helperText && !errorText) return null;

    return (
      <Text
        className={`mt-2 text-sm ${
          errorText ? 'text-red-600' : 'text-muted-foreground'
        }`}
      >
        {errorText || helperText}
      </Text>
    );
  };

  return (
    <View className={textFieldVariants({ preset, size, status, className })}>
      {renderTitle()}
      {renderInput()}
      {renderHelper()}
    </View>
  );
};
