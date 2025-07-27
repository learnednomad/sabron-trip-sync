/**
 * Contrast ratio calculation utilities for accessibility compliance
 * Based on WCAG 2.1 guidelines
 */

interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): ColorRGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Calculate relative luminance of a color
 */
function getLuminance(rgb: ColorRGB): number {
  const { r, g, b } = rgb;

  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;

  const rLinear =
    rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const gLinear =
    gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const bLinear =
    bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) {
    throw new Error('Invalid hex color format');
  }

  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Check if contrast ratio meets WCAG AA standards
 */
export function meetsWCAGAA(
  color1: string,
  color2: string,
  isLargeText = false
): boolean {
  const ratio = getContrastRatio(color1, color2);
  return isLargeText ? ratio >= 3.0 : ratio >= 4.5;
}

/**
 * Check if contrast ratio meets WCAG AAA standards
 */
export function meetsWCAGAAA(
  color1: string,
  color2: string,
  isLargeText = false
): boolean {
  const ratio = getContrastRatio(color1, color2);
  return isLargeText ? ratio >= 4.5 : ratio >= 7.0;
}

/**
 * Validate social button color combinations
 */
export function validateSocialButtonContrasts() {
  const results = {
    google: {
      light: {
        textOnBackground: getContrastRatio('#374151', '#FFFFFF'), // gray-700 on white
        borderOnBackground: getContrastRatio('#E5E7EB', '#FFFFFF'), // gray-200 border on white
      },
      dark: {
        textOnBackground: getContrastRatio('#E5E7EB', '#1F2937'), // gray-200 on gray-800
        borderOnBackground: getContrastRatio('#4B5563', '#1F2937'), // gray-600 border on gray-800
      },
    },
    apple: {
      light: {
        textOnBackground: getContrastRatio('#FFFFFF', '#000000'), // white text on black
        borderOnBackground: getContrastRatio('#000000', '#FFFFFF'), // black border (self)
      },
      dark: {
        textOnBackground: getContrastRatio('#000000', '#FFFFFF'), // black text on white
        borderOnBackground: getContrastRatio('#FFFFFF', '#000000'), // white border (self)
      },
    },
  };

  // Check compliance
  const compliance = {
    google: {
      light: {
        textAACompliant: meetsWCAGAA('#374151', '#FFFFFF'),
        textAAACompliant: meetsWCAGAAA('#374151', '#FFFFFF'),
      },
      dark: {
        textAACompliant: meetsWCAGAA('#E5E7EB', '#1F2937'),
        textAAACompliant: meetsWCAGAAA('#E5E7EB', '#1F2937'),
      },
    },
    apple: {
      light: {
        textAACompliant: meetsWCAGAA('#FFFFFF', '#000000'),
        textAAACompliant: meetsWCAGAAA('#FFFFFF', '#000000'),
      },
      dark: {
        textAACompliant: meetsWCAGAA('#000000', '#FFFFFF'),
        textAAACompliant: meetsWCAGAAA('#000000', '#FFFFFF'),
      },
    },
  };

  return { results, compliance };
}

/**
 * Get accessibility report for social buttons
 */
export function getSocialButtonAccessibilityReport(): string {
  const { results, compliance } = validateSocialButtonContrasts();

  let report = '🔍 Social Button Accessibility Report\n\n';

  // Google Button Analysis
  report += '📱 Google Button:\n';
  report += `  Light Mode: ${results.google.light.textOnBackground.toFixed(2)}:1 ratio `;
  report += `${compliance.google.light.textAACompliant ? '✅ AA' : '❌ AA'} `;
  report += `${compliance.google.light.textAAACompliant ? '✅ AAA' : '❌ AAA'}\n`;

  report += `  Dark Mode:  ${results.google.dark.textOnBackground.toFixed(2)}:1 ratio `;
  report += `${compliance.google.dark.textAACompliant ? '✅ AA' : '❌ AA'} `;
  report += `${compliance.google.dark.textAAACompliant ? '✅ AAA' : '❌ AAA'}\n\n`;

  // Apple Button Analysis
  report += '🍎 Apple Button:\n';
  report += `  Light Mode: ${results.apple.light.textOnBackground.toFixed(2)}:1 ratio `;
  report += `${compliance.apple.light.textAACompliant ? '✅ AA' : '❌ AA'} `;
  report += `${compliance.apple.light.textAAACompliant ? '✅ AAA' : '❌ AAA'}\n`;

  report += `  Dark Mode:  ${results.apple.dark.textOnBackground.toFixed(2)}:1 ratio `;
  report += `${compliance.apple.dark.textAACompliant ? '✅ AA' : '❌ AA'} `;
  report += `${compliance.apple.dark.textAAACompliant ? '✅ AAA' : '❌ AAA'}\n\n`;

  // Overall Summary
  const allAACompliant = Object.values(compliance).every((provider) =>
    Object.values(provider).every((mode) => mode.textAACompliant)
  );

  report += `📊 Overall Compliance: ${allAACompliant ? '✅ All buttons meet WCAG AA standards' : '⚠️ Some buttons need improvement'}\n`;

  return report;
}
