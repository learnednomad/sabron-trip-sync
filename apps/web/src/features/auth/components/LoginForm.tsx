'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, type Login } from '@sabron/validation';
import { Button } from '@sabron/ui';
import { Input } from '@sabron/ui';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/providers/auth-provider';

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Login>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: Login) => {
    try {
      await signIn(data.email, data.password);
    } catch (error) {
      // Error handled by auth provider
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
          autoComplete="current-password"
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

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            {...register('rememberMe')}
            type="checkbox"
            className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
          />
          <label htmlFor="rememberMe" className="ml-2 block text-sm text-foreground">
            Remember me
          </label>
        </div>

        <Link
          href="/forgot-password"
          className="text-sm text-primary hover:text-primary/80"
        >
          Forgot your password?
        </Link>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
        loading={isSubmitting}
      >
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link href="/signup" className="font-medium text-primary hover:text-primary/80">
          Sign up
        </Link>
      </p>
    </form>
  );
}
