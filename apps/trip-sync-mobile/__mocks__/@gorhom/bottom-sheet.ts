import React from 'react';
import { View } from 'react-native';

export const BottomSheetModal = React.forwardRef((props: any, ref: any) => React.createElement(View, { ...props, ref }));
export const BottomSheetModalProvider = ({ children }: { children: React.ReactNode }) => React.createElement(View, {}, children);
export const BottomSheetView = (props: any) => React.createElement(View, props);
export const BottomSheetScrollView = (props: any) => React.createElement(View, props);
export const BottomSheetHandle = (props: any) => React.createElement(View, props);
export const BottomSheetBackdrop = (props: any) => React.createElement(View, props);

export default {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
  BottomSheetScrollView,
  BottomSheetHandle,
  BottomSheetBackdrop,
};