'use client';

import * as React from 'react';
import { Theme } from '@radix-ui/themes';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProps } from '@/types/radix-themes';
import type { WithChildren } from '@/types';

interface ThemeProviderProps extends WithChildren {
  defaultTheme?: 'light' | 'dark' | 'system';
  storageKey?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  radixThemeConfig?: Partial<ThemeProps>;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme',
  enableSystem = true,
  disableTransitionOnChange = false,
  radixThemeConfig = {},
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultTheme}
      storageKey={storageKey}
      enableSystem={enableSystem}
      disableTransitionOnChange={disableTransitionOnChange}
    >
      <Theme
        accentColor="blue"
        grayColor="slate"
        radius="medium"
        scaling="100%"
        panelBackground="translucent"
        {...radixThemeConfig}
      >
        {children}
      </Theme>
    </NextThemesProvider>
  );
}

// Hook to use theme configuration
export function useThemeConfig() {
  const [themeConfig, setThemeConfig] = React.useState<Partial<ThemeProps>>({
    accentColor: 'blue',
    grayColor: 'slate',
    radius: 'medium',
    scaling: '100%',
  });

  const updateThemeConfig = React.useCallback((config: Partial<ThemeProps>) => {
    setThemeConfig((prev) => ({ ...prev, ...config }));
  }, []);

  return { themeConfig, updateThemeConfig };
}