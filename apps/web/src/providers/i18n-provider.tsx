'use client';

import { i18next } from '@sabron/i18n';
import { I18nextProvider } from 'react-i18next';

import type { ReactNode } from 'react';

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
}
