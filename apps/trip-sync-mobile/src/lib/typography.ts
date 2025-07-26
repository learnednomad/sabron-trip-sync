import { PixelRatio } from 'react-native';

/**
 * Typography utilities for Dynamic Type support and Apple HIG compliance
 * Implements Apple's text style hierarchy with proper scaling
 */

// Apple HIG text styles with base sizes (iOS/iPadOS Large - default)
export const textStyles = {
  largeTitle: { size: 34, lineHeight: 41, weight: '400' as const },
  title1: { size: 28, lineHeight: 34, weight: '400' as const },
  title2: { size: 22, lineHeight: 28, weight: '400' as const },
  title3: { size: 20, lineHeight: 25, weight: '400' as const },
  headline: { size: 17, lineHeight: 22, weight: '600' as const },
  body: { size: 17, lineHeight: 22, weight: '400' as const },
  callout: { size: 16, lineHeight: 21, weight: '400' as const },
  subhead: { size: 15, lineHeight: 20, weight: '400' as const },
  footnote: { size: 13, lineHeight: 18, weight: '400' as const },
  caption1: { size: 12, lineHeight: 16, weight: '400' as const },
  caption2: { size: 11, lineHeight: 13, weight: '400' as const },
} as const;

export type TextStyle = keyof typeof textStyles;

// Dynamic Type scaling factors based on iOS accessibility settings
export const dynamicTypeScales = {
  xSmall: 0.82,
  small: 0.88,
  medium: 0.94,
  large: 1.0, // Default
  xLarge: 1.12,
  xxLarge: 1.24,
  xxxLarge: 1.35,
  // Accessibility sizes
  ax1: 1.64,
  ax2: 1.94,
  ax3: 2.35,
  ax4: 2.76,
  ax5: 3.12,
} as const;

export type DynamicTypeScale = keyof typeof dynamicTypeScales;

/**
 * Get scaled font size based on text style and current accessibility settings
 * @param style - Apple HIG text style
 * @param scale - Dynamic Type scale (defaults to 'large')
 * @returns Scaled font size in points
 */
export function getScaledFontSize(
  style: TextStyle,
  scale: DynamicTypeScale = 'large'
): number {
  const baseSize = textStyles[style].size;
  const scaleFactor = dynamicTypeScales[scale];
  return Math.round(baseSize * scaleFactor);
}

/**
 * Get scaled line height based on text style and current accessibility settings
 * @param style - Apple HIG text style
 * @param scale - Dynamic Type scale (defaults to 'large')
 * @returns Scaled line height in points
 */
export function getScaledLineHeight(
  style: TextStyle,
  scale: DynamicTypeScale = 'large'
): number {
  const baseLineHeight = textStyles[style].lineHeight;
  const scaleFactor = dynamicTypeScales[scale];
  return Math.round(baseLineHeight * scaleFactor);
}

/**
 * Get font weight for text style
 * @param style - Apple HIG text style
 * @returns Font weight string
 */
export function getFontWeight(style: TextStyle): string {
  return textStyles[style].weight;
}

/**
 * Convert points to pixels based on device pixel ratio
 * This ensures consistent sizing across different screen densities
 * @param points - Size in points
 * @returns Size in pixels
 */
export function pointsToPixels(points: number): number {
  return PixelRatio.getPixelSizeForLayoutSize(points);
}

/**
 * Get complete text style object for use with React Native Text component
 * @param style - Apple HIG text style
 * @param scale - Dynamic Type scale (defaults to 'large')
 * @returns Style object with fontSize, lineHeight, and fontWeight
 */
export function getTextStyle(
  style: TextStyle,
  scale: DynamicTypeScale = 'large'
) {
  return {
    fontSize: getScaledFontSize(style, scale),
    lineHeight: getScaledLineHeight(style, scale),
    fontWeight: getFontWeight(style),
  };
}

/**
 * Accessibility helper to determine if current scale is in accessibility range
 * @param scale - Dynamic Type scale
 * @returns True if scale is accessibility-sized (AX1-AX5)
 */
export function isAccessibilityScale(scale: DynamicTypeScale): boolean {
  return scale.startsWith('ax');
}

/**
 * Get minimum touch target size based on Apple HIG (44pt minimum)
 * @param scale - Dynamic Type scale for accessibility adjustments
 * @returns Minimum touch target size in points
 */
export function getMinimumTouchTarget(
  scale: DynamicTypeScale = 'large'
): number {
  const baseSize = 44; // Apple HIG minimum 44pt
  // For accessibility scales, potentially increase touch targets
  if (isAccessibilityScale(scale)) {
    const scaleFactor = dynamicTypeScales[scale];
    return Math.max(baseSize, Math.round(baseSize * scaleFactor * 0.8));
  }
  return baseSize;
}

/**
 * Tailwind CSS class helpers for text styles
 * These map to NativeWind classes for consistent styling
 */
export const textStyleClasses = {
  largeTitle: 'text-[34px] leading-[41px] font-normal',
  title1: 'text-[28px] leading-[34px] font-normal',
  title2: 'text-[22px] leading-[28px] font-normal',
  title3: 'text-[20px] leading-[25px] font-normal',
  headline: 'text-[17px] leading-[22px] font-semibold',
  body: 'text-[17px] leading-[22px] font-normal',
  callout: 'text-[16px] leading-[21px] font-normal',
  subhead: 'text-[15px] leading-[20px] font-normal',
  footnote: 'text-[13px] leading-[18px] font-normal',
  caption1: 'text-[12px] leading-[16px] font-normal',
  caption2: 'text-[11px] leading-[13px] font-normal',
} as const;

/**
 * Get Tailwind CSS class for text style with Dynamic Type scaling
 * @param style - Apple HIG text style
 * @param scale - Dynamic Type scale (defaults to 'large')
 * @returns Tailwind CSS class string
 */
export function getTextStyleClass(
  style: TextStyle,
  scale: DynamicTypeScale = 'large'
): string {
  if (scale === 'large') {
    return textStyleClasses[style];
  }

  // For non-default scales, use custom sizing
  const fontSize = getScaledFontSize(style, scale);
  const lineHeight = getScaledLineHeight(style, scale);
  const weight = getFontWeight(style);

  const weightClass = weight === '600' ? 'font-semibold' : 'font-normal';

  return `text-[${fontSize}px] leading-[${lineHeight}px] ${weightClass}`;
}
