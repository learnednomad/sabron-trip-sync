import { Env } from '@env';
import { useColorScheme } from 'nativewind';
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import type { Provider } from '@supabase/supabase-js';

import { 
  Item, 
  ItemsContainer, 
  LanguageItem, 
  ThemeItem 
} from '@/features/settings';
import {
  colors,
  FocusAwareStatusBar,
  ScrollView,
  Text,
  View,
  Button,
} from '@/components/ui';
import { Github, Rate, Share, Support, Website } from '@/components/ui/icons';
import { translate, useAuth } from '@/lib';
import { signInWithProvider } from '@/lib/auth';

interface LinkedAccount {
  provider: string;
  email: string;
  linkedAt: string;
  isVerified: boolean;
}

export default function Settings() {
  const signOut = useAuth.use.signOut();
  const user = useAuth.use.user();
  const { colorScheme } = useColorScheme();
  const iconColor =
    colorScheme === 'dark' ? colors.neutral[400] : colors.neutral[500];
  
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([]);

  useEffect(() => {
    if (user) {
      loadLinkedAccounts();
    }
  }, [user]);

  const loadLinkedAccounts = () => {
    try {
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
    }
  };

  const handleLinkAccount = async (provider: Provider) => {
    try {
      await signInWithProvider(provider);
      Alert.alert(
        'Account Linking',
        `Linking ${provider} account...`,
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      console.error(`Failed to link ${provider} account:`, error);
      // Error is already handled in the auth store
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
  return (
    <>
      <FocusAwareStatusBar />

      <ScrollView>
        <View className="flex-1 px-4 pt-16 ">
          <Text className="text-xl font-bold">
            {translate('settings.title')}
          </Text>
          <ItemsContainer title="settings.generale">
            <LanguageItem />
            <ThemeItem />
          </ItemsContainer>

          <ItemsContainer title="Linked Accounts">
            {linkedAccounts.map((account, index) => (
              <Item
                key={index}
                text={`${getProviderIcon(account.provider)} ${getProviderName(account.provider)}`}
                value={account.isVerified ? '✓ Verified' : 'Unverified'}
                onPress={() => {}}
              />
            ))}
            {unlinkableProviders.map((provider) => (
              <Item
                key={provider}
                text={`${getProviderIcon(provider)} Link ${getProviderName(provider)}`}
                value="Not linked"
                onPress={() => handleLinkAccount(provider)}
              />
            ))}
          </ItemsContainer>

          <ItemsContainer title="settings.about">
            <Item text="settings.app_name" value={Env.NAME} />
            <Item text="settings.version" value={Env.VERSION} />
          </ItemsContainer>

          <ItemsContainer title="settings.support_us">
            <Item
              text="settings.share"
              icon={<Share color={iconColor} />}
              onPress={() => {}}
            />
            <Item
              text="settings.rate"
              icon={<Rate color={iconColor} />}
              onPress={() => {}}
            />
            <Item
              text="settings.support"
              icon={<Support color={iconColor} />}
              onPress={() => {}}
            />
          </ItemsContainer>

          <ItemsContainer title="settings.links">
            <Item text="settings.privacy" onPress={() => {}} />
            <Item text="settings.terms" onPress={() => {}} />
            <Item
              text="settings.github"
              icon={<Github color={iconColor} />}
              onPress={() => {}}
            />
            <Item
              text="settings.website"
              icon={<Website color={iconColor} />}
              onPress={() => {}}
            />
          </ItemsContainer>

          <View className="my-8">
            <ItemsContainer>
              <Item text="settings.logout" onPress={signOut} />
            </ItemsContainer>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
