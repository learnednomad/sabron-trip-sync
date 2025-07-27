'use client';

import { Button } from '@sabron/ui';
import type { Provider } from '@supabase/supabase-js';
import { Chrome, Apple } from 'lucide-react';
import { useState } from 'react';

import { useAuth } from '@/providers/auth-provider';

interface SocialLoginButtonProps {
  provider: Provider;
  disabled?: boolean;
  className?: string;
}

const providerConfig = {
  google: {
    label: 'Continue with Google',
    icon: Chrome,
    className: 'border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800',
  },
  apple: {
    label: 'Continue with Apple',
    icon: Apple,
    className: 'border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800',
  },
  facebook: {
    label: 'Continue with Facebook',
    icon: () => (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    className: 'border-blue-300 hover:bg-blue-50 text-blue-600 dark:border-blue-600 dark:hover:bg-blue-900/20 dark:text-blue-400',
  },
} as const;

export const SocialLoginButton = ({ 
  provider, 
  disabled = false, 
  className = '' 
}: SocialLoginButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithProvider } = useAuth();
  
  const config = providerConfig[provider as keyof typeof providerConfig];
  
  if (!config) {
    return null;
  }

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await signInWithProvider(provider);
    } catch (error) {
      // Error is handled by auth provider
    } finally {
      setIsLoading(false);
    }
  };

  const IconComponent = config.icon;

  return (
    <Button
      variant="outline"
      size="lg"
      onClick={handleClick}
      disabled={disabled || isLoading}
      loading={isLoading}
      className={`w-full justify-start gap-3 ${config.className} ${className}`}
    >
      <IconComponent className="h-5 w-5" />
      {config.label}
    </Button>
  );
};