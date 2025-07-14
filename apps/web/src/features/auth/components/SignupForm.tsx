'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@sabron/ui';
import { RegisterSchema, type Register } from '@sabron/validation';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useAuth } from '@/providers/auth-provider';

export const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { signUp } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Register>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (data: Register) => {
    try {
      await signUp(data.email, data.password, data.name);
    } catch (error) {
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

      <Input
        {...register('confirmPassword')}
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        label="Confirm Password"
        type={showPassword ? 'text' : 'password'}
      />

      <div className="flex items-center">
        <input
          {...register('acceptTerms')}
          className="size-4 rounded border-input text-primary focus:ring-primary"
          type="checkbox"
        />
        <label className="ml-2 block text-sm text-foreground" htmlFor="acceptTerms">
          I accept the <Link className="text-primary hover:text-primary/80" href="/terms">Terms of Service</Link>
        </label>
      </div>

      <Button
        className="w-full"
        disabled={isSubmitting}
        loading={isSubmitting}
        type="submit"
      >
        {isSubmitting ? 'Creating Account...' : 'Create Account'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link className="font-medium text-primary hover:text-primary/80" href="/login">
          Sign in
        </Link>
      </p>
    </form>
  );
}
