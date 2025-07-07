'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema, type Register } from '@sabron/validation';
import { Button, Input } from '@sabron/ui';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/providers/auth-provider';

export function SignupForm() {
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        {...register('name')}
        label="Full Name"
        autoComplete="name"
        error={errors.name?.message}
      />

      <Input
        {...register('email')}
        type="email"
        label="Email address"
        autoComplete="email"
        error={errors.email?.message}
      />

      <div className="relative">
        <Input
          {...register('password')}
          type={showPassword ? 'text' : 'password'}
          label="Password"
          autoComplete="new-password"
          error={errors.password?.message}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3 top-1/2 -translate-y-1/2"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5 text-muted-foreground" />
          ) : (
            <Eye className="h-5 w-5 text-muted-foreground" />
          )}
        </button>
      </div>

      <Input
        {...register('confirmPassword')}
        type={showPassword ? 'text' : 'password'}
        label="Confirm Password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
      />

      <div className="flex items-center">
        <input
          {...register('acceptTerms')}
          type="checkbox"
          className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
        />
        <label htmlFor="acceptTerms" className="ml-2 block text-sm text-foreground">
          I accept the <Link href="/terms" className="text-primary hover:text-primary/80">Terms of Service</Link>
        </label>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
        loading={isSubmitting}
      >
        {isSubmitting ? 'Creating Account...' : 'Create Account'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-primary hover:text-primary/80">
          Sign in
        </Link>
      </p>
    </form>
  );
}
