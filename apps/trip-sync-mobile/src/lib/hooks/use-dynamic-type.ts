import { useCallback, useEffect, useState } from 'react';
import { AccessibilityInfo, Appearance } from 'react-native';

import type { DynamicTypeScale } from '../typography';

// Scale factors mapping for Dynamic Type
const SCALE_FACTORS = {
  xSmall: 0.82,
  small: 0.88,
  medium: 0.94,
  large: 1.0,
  xLarge: 1.12,
  xxLarge: 1.24,
  xxxLarge: 1.35,
  ax1: 1.64,
  ax2: 1.94,
  ax3: 2.35,
  ax4: 2.76,
  ax5: 3.12,
};

/**
 * Hook to manage Dynamic Type settings and accessibility scaling
 * Provides current scale factor and utilities for text scaling
 */
export function useDynamicType() {
  const [scale, setScale] = useState<DynamicTypeScale>('large');
  const [isReduceMotionEnabled, setIsReduceMotionEnabled] = useState(false);
  const [isBoldTextEnabled, setIsBoldTextEnabled] = useState(false);

  // Update scale based on system accessibility settings
  const updateScale = useCallback(async () => {
    try {
      const isReduceMotion = await AccessibilityInfo.isReduceMotionEnabled();
      const isBoldText = await AccessibilityInfo.isBoldTextEnabled();

      setIsReduceMotionEnabled(isReduceMotion);
      setIsBoldTextEnabled(isBoldText);
      setScale('large'); // Default scale for now
    } catch (error) {
      console.warn('Failed to detect accessibility settings:', error);
      setScale('large');
    }
  }, []);

  useEffect(() => {
    updateScale();

    const reduceMotionListener = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setIsReduceMotionEnabled
    );

    const boldTextListener = AccessibilityInfo.addEventListener(
      'boldTextChanged',
      setIsBoldTextEnabled
    );

    const appearanceListener = Appearance.addChangeListener(() => {
      updateScale();
    });

    return () => {
      reduceMotionListener?.remove();
      boldTextListener?.remove();
      appearanceListener?.remove();
    };
  }, [updateScale]);

  const setDynamicTypeScale = useCallback((newScale: DynamicTypeScale) => {
    setScale(newScale);
  }, []);

  const isAccessibilityScale = useCallback(() => {
    return scale.startsWith('ax');
  }, [scale]);

  const getScaleFactor = useCallback(() => {
    return SCALE_FACTORS[scale];
  }, [scale]);

  return {
    scale,
    scaleFactor: getScaleFactor(),
    isAccessibilityScale: isAccessibilityScale(),
    isReduceMotionEnabled,
    isBoldTextEnabled,
    setDynamicTypeScale,
    updateScale,
  };
}
