import React from 'react';
import type { TextProps, TextStyle } from 'react-native';
import { I18nManager, StyleSheet, Text as NNText } from 'react-native';
import { twMerge } from 'tailwind-merge';

import { useDynamicType } from '@/lib/hooks/use-dynamic-type';
import type { TxKeyPath } from '@/lib/i18n';
import { translate } from '@/lib/i18n';
import {
  getTextStyle,
  type TextStyle as AppleTextStyle,
} from '@/lib/typography';

interface Props extends TextProps {
  className?: string;
  tx?: TxKeyPath;
  textStyle?: AppleTextStyle;
  dynamicType?: boolean;
}

export const Text = ({
  className = '',
  style,
  tx,
  children,
  textStyle = 'body',
  dynamicType = true,
  ...props
}: Props) => {
  const { scale, isBoldTextEnabled } = useDynamicType();

  const combinedClassName = React.useMemo(
    () =>
      twMerge(
        'text-base text-black dark:text-white font-inter font-normal',
        className
      ),
    [className]
  );

  const dynamicStyle = React.useMemo(() => {
    if (!dynamicType) return {};

    const appleTextStyle = getTextStyle(textStyle, scale);
    return {
      fontSize: appleTextStyle.fontSize,
      lineHeight: appleTextStyle.lineHeight,
      fontWeight: isBoldTextEnabled ? 'bold' : appleTextStyle.fontWeight,
    };
  }, [dynamicType, textStyle, scale, isBoldTextEnabled]);

  const nStyle = React.useMemo(
    () =>
      StyleSheet.flatten([
        {
          writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
        },
        dynamicStyle,
        style,
      ]) as TextStyle,
    [style, dynamicStyle]
  );

  return (
    <NNText
      className={combinedClassName}
      style={nStyle}
      accessible={true}
      accessibilityRole="text"
      {...props}
    >
      {tx ? translate(tx) : children}
    </NNText>
  );
};
