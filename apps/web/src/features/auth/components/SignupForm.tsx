'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@sabron/ui';
import { RegisterSchema, type Register } from '@sabron/validation';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Checkbox } from '@/components/ui/checkbox';

import { useAuth } from '@/providers/auth-provider';

export const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signUp } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Register>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      marketingConsent: false,
    },
  });

  const onSubmit = async (data: Register) => {
    try {
      await signUp(data.email, data.password, data.name);
    } catch (_error) {
      // Error handled by auth provider
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register('name')}
        autoComplete="name"
        error={errors.name?.message}
        label="Full Name"
        type="text"
      />

      <Input
        {...register('email')}
        autoComplete="email"
        error={errors.email?.message}
        label="Email address"
        type="email"
      />

      <div className="relative">
        <Input
          {...register('password')}
          autoComplete="new-password"
          error={errors.password?.message}
          label="Password"
          type={showPassword ? 'text' : 'password'}
        />
        <button
          className="absolute inset-y-0 right-0 top-1/2 flex -translate-y-1/2 items-center pr-3"
          type="button"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="size-5 text-muted-foreground" />
          ) : (
            <Eye className="size-5 text-muted-foreground" />
          )}
        </button>
      </div>

      <div className="relative">
        <Input
          {...register('confirmPassword')}
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
        />
        <button
          className="absolute inset-y-0 right-0 top-1/2 flex -translate-y-1/2 items-center pr-3"
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          {showConfirmPassword ? (
            <EyeOff className="size-5 text-muted-foreground" />
          ) : (
            <Eye className="size-5 text-muted-foreground" />
          )}
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-start">
          <Checkbox
            id="acceptTerms"
            checked={watch('acceptTerms') === true}
            onCheckedChange={(checked) => setValue('acceptTerms', checked as true)}
            className="mt-0.5"
          />
          <label 
            htmlFor="acceptTerms" 
            className="ml-2 block text-sm text-foreground"
          >
            I agree to the{' '}
            <Link className="text-primary hover:text-primary/80" href="/terms">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link className="text-primary hover:text-primary/80" href="/privacy">
              Privacy Policy
            </Link>
          </label>
        </div>
        {errors.acceptTerms && (
          <p className="text-sm text-destructive">{errors.acceptTerms.message}</p>
        )}

        <div className="flex items-start">
          <Checkbox
            id="marketingConsent"
            checked={watch('marketingConsent')}
            onCheckedChange={(checked) => setValue('marketingConsent', checked === true)}
            className="mt-0.5"
          />
          <label 
            htmlFor="marketingConsent" 
            className="ml-2 block text-sm text-foreground"
          >
            I want to receive updates and marketing communications
          </label>
        </div>
      </div>

      <Button
        className="w-full"
        disabled={isSubmitting}
        loading={isSubmitting}
        type="submit"
      >
        {isSubmitting ? 'Creating account...' : 'Create account'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link className="font-medium text-primary hover:text-primary/80" href="/login">
          Sign in
        </Link>
      </p>
    </form>
  );
};