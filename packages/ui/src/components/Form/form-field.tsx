'use client';

import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Input, type InputProps } from '../ui/input';
import { cn } from '../../lib/utils';

interface FormFieldProps extends Omit<InputProps, 'name'> {
  name: string;
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ name, className, ...props }, ref) => {
    const { control } = useFormContext();

    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Input
            {...field}
            {...props}
            ref={ref}
            error={error?.message}
            className={cn(className)}
          />
        )}
      />
    );
  }
);
FormField.displayName = 'FormField';

export { FormField };
