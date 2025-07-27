'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@sabron/ui';
import { ResetPasswordSchema, type ResetPassword } from '@sabron/validation';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useAuth } from '@/providers/auth-provider';

export const ResetPasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { updatePassword } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPassword>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      token,
    },
  });

  const onSubmit = async (data: ResetPassword) => {
    try {
      await updatePassword(data.password);
      router.push('/dashboard?passwordReset=true');
    } catch (_error) {
      // Error handled by auth provider
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-foreground">
          Reset Your Password
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your new password below
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <input {...register('token')} type="hidden" />

        <div className="relative">
          <Input
            {...register('password')}
            autoComplete="new-password"
            error={errors.password?.message}
            label="New Password"
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
            label="Confirm New Password"
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

        <Button
          className="w-full"
          disabled={isSubmitting}
          loading={isSubmitting}
          type="submit"
        >
          {isSubmitting ? 'Updating password...' : 'Update password'}
        </Button>
      </form>
    </div>
  );
};