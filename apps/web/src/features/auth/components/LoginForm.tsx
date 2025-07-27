'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button , Input } from '@sabron/ui';
import { LoginSchema, type Login } from '@sabron/validation';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useAuth } from '@/providers/auth-provider';
import { SocialLoginGroup } from './SocialLoginGroup';

export const LoginForm = () => {
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
    } catch (_error) {
      // Error handled by auth provider
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
          autoComplete="current-password"
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

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            {...register('rememberMe')}
            className="size-4 rounded border-input text-primary focus:ring-primary"
            type="checkbox"
          />
          <label className="ml-2 block text-sm text-foreground" htmlFor="rememberMe">
            Remember me
          </label>
        </div>

        <Link
          className="text-sm text-primary hover:text-primary/80"
          href="/forgot-password"
        >
          Forgot your password?
        </Link>
      </div>

      <Button
        className="w-full"
        disabled={isSubmitting}
        loading={isSubmitting}
        type="submit"
      >
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </Button>

      <SocialLoginGroup disabled={isSubmitting} />

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link className="font-medium text-primary hover:text-primary/80" href="/signup">
          Sign up
        </Link>
      </p>
    </form>
  );
}
