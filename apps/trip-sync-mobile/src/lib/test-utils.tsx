import '@shopify/flash-list/jestSetup';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { NavigationContainer } from '@react-navigation/native';
import type { RenderOptions } from '@testing-library/react-native';
import { render, userEvent } from '@testing-library/react-native';
import type { ReactElement } from 'react';
import React from 'react';

interface WrapperProps {
  children: React.ReactNode;
}

const createAppWrapper = () => {
  return ({ children }: WrapperProps) => (
    <BottomSheetModalProvider>
      <NavigationContainer>{children as any}</NavigationContainer>
    </BottomSheetModalProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const Wrapper = createAppWrapper(); // make sure we have a new wrapper for each render
  return render(ui as any, { wrapper: Wrapper, ...options });
};

// use this if you want to test user events
export const setup = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const Wrapper = createAppWrapper();
  return {
    user: userEvent.setup(),
    ...render(ui as any, { wrapper: Wrapper, ...options }),
  };
};

export * from '@testing-library/react-native';
export { customRender as render };
