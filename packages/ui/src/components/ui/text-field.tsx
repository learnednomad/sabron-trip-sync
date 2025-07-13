import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';
import { Input } from './input';

const textFieldVariants = cva(
  'space-y-2',
  {
    variants: {
      preset: {
        default: '',
        travel: 'space-y-3',
        compact: 'space-y-1',
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
      status: 'default',
    },
  }
);

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  {
    variants: {
      status: {
        default: 'text-foreground',
        error: 'text-destructive',
        success: 'text-green-600',
        warning: 'text-yellow-600',
      },
    },
    defaultVariants: {
      status: 'default',
    },
  }
);

const inputVariants = cva(
  '',
  {
    variants: {
      status: {
        default: '',
        error: 'border-destructive focus-visible:ring-destructive',
        success: 'border-green-500 focus-visible:ring-green-500',
        warning: 'border-yellow-500 focus-visible:ring-yellow-500',
      },
      preset: {
        default: '',
        travel: 'border-blue-200 focus-visible:ring-blue-500',
        compact: 'h-8 px-2 text-xs',
      },
    },
    defaultVariants: {
      status: 'default',
      preset: 'default',
    },
  }
);

const helperVariants = cva(
  'text-xs',
  {
    variants: {
      status: {
        default: 'text-muted-foreground',
        error: 'text-destructive',
        success: 'text-green-600',
        warning: 'text-yellow-600',
      },
    },
    defaultVariants: {
      status: 'default',
    },
  }
);

export interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof textFieldVariants> {
  label?: string;
  labelTx?: string;
  labelTxOptions?: Record<string, any>;
  
  helper?: string;
  helperTx?: string;
  helperTxOptions?: Record<string, any>;
  
  error?: string;
  errorTx?: string;
  errorTxOptions?: Record<string, any>;
  
  placeholderTx?: string;
  placeholderTxOptions?: Record<string, any>;
  
  containerStyle?: string;
  labelStyle?: string;
  inputStyle?: string;
  helperStyle?: string;
  
  required?: boolean;
  forwardedRef?: React.Ref<HTMLInputElement>;
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({
    className,
    preset,
    status: propStatus,
    label,
    labelTx,
    labelTxOptions,
    helper,
    helperTx,
    helperTxOptions,
    error,
    errorTx,
    errorTxOptions,
    placeholder,
    placeholderTx,
    placeholderTxOptions,
    containerStyle,
    labelStyle,
    inputStyle,
    helperStyle,
    required,
    id,
    ...props
  }, ref) => {
    const { t } = useTranslation();
    
    // Determine status based on error prop
    const status = error || errorTx ? 'error' : propStatus || 'default';
    
    // Generate unique ID if not provided
    const fieldId = id || React.useId();
    
    // Translate strings
    const labelText = labelTx ? t(labelTx, labelTxOptions) : label;
    const helperText = helperTx ? t(helperTx, helperTxOptions) : helper;
    const errorText = errorTx ? t(errorTx, errorTxOptions) : error;
    const placeholderText = placeholderTx ? t(placeholderTx, placeholderTxOptions) : placeholder;
    
    // Final helper text (error takes precedence)
    const finalHelperText = errorText || helperText;
    const finalHelperStatus = errorText ? 'error' : status;

    return (
      <div className={cn(textFieldVariants({ preset, status, className }), containerStyle)}>
        {labelText && (
          <label
            htmlFor={fieldId}
            className={cn(labelVariants({ status }), labelStyle)}
          >
            {labelText}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        
        <Input
          id={fieldId}
          ref={ref}
          placeholder={placeholderText}
          className={cn(inputVariants({ status, preset }), inputStyle)}
          aria-invalid={status === 'error' ? 'true' : 'false'}
          aria-describedby={finalHelperText ? `${fieldId}-helper` : undefined}
          {...props}
        />
        
        {finalHelperText && (
          <p
            id={`${fieldId}-helper`}
            className={cn(helperVariants({ status: finalHelperStatus }), helperStyle)}
          >
            {finalHelperText}
          </p>
        )}
      </div>
    );
  }
);

TextField.displayName = 'TextField';

export { TextField, textFieldVariants };