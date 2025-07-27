'use client';

import type { Provider } from '@supabase/supabase-js';

import { SocialLoginButton } from './SocialLoginButton';

interface SocialLoginGroupProps {
  providers?: Provider[];
  disabled?: boolean;
  className?: string;
  showDivider?: boolean;
  dividerText?: string;
}

const defaultProviders: Provider[] = ['google', 'apple', 'facebook'];

export const SocialLoginGroup = ({ 
  providers = defaultProviders,
  disabled = false,
  className = '',
  showDivider = true,
  dividerText = 'OR'
}: SocialLoginGroupProps) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {showDivider && (
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
              {dividerText}
            </span>
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        {providers.map((provider) => (
          <SocialLoginButton
            key={provider}
            provider={provider}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
};