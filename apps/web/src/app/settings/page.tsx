'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@sabron/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sabron/ui';
import { toast } from 'sonner';
import type { Provider } from '@supabase/supabase-js';

interface LinkedAccount {
  provider: string;
  email: string;
  linkedAt: string;
  isVerified: boolean;
}

export default function SettingsPage() {
  const { user, signInWithProvider } = useAuth();
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadLinkedAccounts();
    }
  }, [user]);

  const loadLinkedAccounts = async () => {
    try {
      setLoading(true);
      
      // Get linked accounts from user identities
      const accounts: LinkedAccount[] = [];
      
      // Add primary account (current authentication method)
      if (user?.email) {
        accounts.push({
          provider: user.app_metadata.provider || 'email',
          email: user.email,
          linkedAt: user.created_at || new Date().toISOString(),
          isVerified: user.email_confirmed_at !== null,
        });
      }

      // Add additional linked identities if available
      if (user?.identities) {
        user.identities.forEach((identity) => {
          if (identity.provider !== (user.app_metadata.provider || 'email')) {
            accounts.push({
              provider: identity.provider,
              email: identity.identity_data?.email || user.email || '',
              linkedAt: identity.created_at,
              isVerified: true,
            });
          }
        });
      }

      setLinkedAccounts(accounts);
    } catch (error) {
      console.error('Failed to load linked accounts:', error);
      toast.error('Failed to load account information');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkAccount = async (provider: Provider) => {
    try {
      await signInWithProvider(provider);
      toast.success(`Linking ${provider} account...`);
    } catch (error: any) {
      console.error(`Failed to link ${provider} account:`, error);
      // Error is already handled in the auth provider
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'google':
        return '🔍';
      case 'apple':
        return '🍎';
      case 'email':
        return '📧';
      default:
        return '🔗';
    }
  };

  const getProviderName = (provider: string) => {
    switch (provider) {
      case 'google':
        return 'Google';
      case 'apple':
        return 'Apple';
      case 'email':
        return 'Email';
      default:
        return provider.charAt(0).toUpperCase() + provider.slice(1);
    }
  };

  const availableProviders: Provider[] = ['google', 'apple'];
  const linkedProviders = linkedAccounts.map(account => account.provider);
  const unlinkableProviders = availableProviders.filter(provider => !linkedProviders.includes(provider));

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage your account information and linked social accounts.
        </p>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Your basic account information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <p className="mt-1 text-gray-900 dark:text-white">
              {user?.user_metadata?.name || 'Not provided'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <p className="mt-1 text-gray-900 dark:text-white">{user?.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Member Since</label>
            <p className="mt-1 text-gray-900 dark:text-white">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Linked Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>Linked Accounts</CardTitle>
          <CardDescription>
            Social accounts connected to your TripSync account for easy sign-in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {linkedAccounts.map((account, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl" role="img" aria-label={account.provider}>
                    {getProviderIcon(account.provider)}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {getProviderName(account.provider)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {account.email}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Linked on {new Date(account.linkedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {account.isVerified && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Verified
                    </span>
                  )}
                  {account.provider === (user?.app_metadata.provider || 'email') && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Primary
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Link Additional Accounts */}
          {unlinkableProviders.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                Link Additional Accounts
              </h4>
              <div className="space-y-3">
                {unlinkableProviders.map((provider) => (
                  <div
                    key={provider}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl" role="img" aria-label={provider}>
                        {getProviderIcon(provider)}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {getProviderName(provider)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Not linked
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleLinkAccount(provider)}
                      variant="outline"
                      size="sm"
                    >
                      Link Account
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}