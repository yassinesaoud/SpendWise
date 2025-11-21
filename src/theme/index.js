/**
 * SpendWise Theme Configuration
 * Color palette and design tokens
 */

import { Platform } from 'react-native';

// Helper to create web-compatible shadows
const createShadow = (shadowColor, shadowOffset, shadowOpacity, shadowRadius, elevation) => {
  if (Platform.OS === 'web') {
    return {
      boxShadow: `${shadowOffset.width}px ${shadowOffset.height}px ${shadowRadius}px rgba(0, 0, 0, ${shadowOpacity})`,
    };
  }
  return {
    shadowColor,
    shadowOffset,
    shadowOpacity,
    shadowRadius,
    elevation,
  };
};

export const Colors = {
  primary: '#233675',
  secondary: '#4062BB',
  accent: '#23A8F2',
  success: '#2ECC71',
  danger: '#E74C3C',
  warning: '#F1C40F',
  backgroundLight: '#F5F7FA',
  textPrimary: '#1C1C1E',
  textSecondary: '#6E6E73',
  white: '#FFFFFF',
  black: '#000000',
  border: '#E5E5EA',
  cardBackground: '#FFFFFF',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const Typography = {
  fontFamily: {
    regular: Platform.select({
      ios: 'System',
      android: 'sans-serif',
      default: 'sans-serif',
    }),
    medium: Platform.select({
      ios: 'System',
      android: 'sans-serif-medium',
      default: 'sans-serif',
    }),
    semiBold: Platform.select({
      ios: 'System',
      android: 'sans-serif-medium',
      default: 'sans-serif',
    }),
    bold: Platform.select({
      ios: 'System',
      android: 'sans-serif',
      default: 'sans-serif',
    }),
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
};

export const Shadows = {
  small: createShadow('#000', { width: 0, height: 2 }, 0.1, 4, 2),
  medium: createShadow('#000', { width: 0, height: 4 }, 0.15, 8, 4),
  large: createShadow('#000', { width: 0, height: 8 }, 0.2, 16, 8),
};

export default {
  Colors,
  Spacing,
  BorderRadius,
  Typography,
  Shadows,
};

