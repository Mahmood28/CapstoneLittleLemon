// Little Lemon Design System
export const Colors = {
  // Primary Brand Colors
  primary: '#495E57', // Dark Green
  secondary: '#F4CE14', // Yellow
  
  // Background Colors
  background: '#FFFFFF',
  surface: '#EDEFEE', // Light Gray
  hero: '#495E57', // Dark Green
  
  // Text Colors
  text: '#333333',
  textLight: '#495E57',
  textOnDark: '#FFFFFF',
  textSecondary: '#717171',
  
  // Accent Colors
  accent: '#EE9972', // Peach/Orange
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  
  // Button Colors
  buttonPrimary: '#F4CE14',
  buttonSecondary: '#495E57',
  buttonDisabled: '#CCCCCC',
};

export const Typography = {
  // Font Sizes
  displayLarge: 40,
  displayMedium: 32,
  headline: 24,
  title: 20,
  body: 16,
  bodySmall: 14,
  caption: 12,
  
  // Font Weights
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
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
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 25,
  circle: 50,
};

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
};

export const CommonStyles = {
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  shadow: Shadows.medium,
};