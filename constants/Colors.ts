/**
 * Colors used throughout the app, for both light and dark modes.
 * Modern palette with clean, user-friendly colors.
 */

import { ColorSchemeName } from 'react-native';

// Main colors 
const primaryLight = '#FF5A8C'; // Brighter pink
const primaryDark = '#FF7BA6';
const accentLight = '#FF4077'; // Deeper pink
const accentDark = '#FF5F8F'; 
const successLight = '#4DD663';
const successDark = '#34BE4B';

const tintColorLight = '#648286';
const tintColorDark = '#648286';

const Colors = {
  light: {
    // Base colors
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    
    // UI elements
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    separator: '#eee',
    cardBackground: '#fff',
    
    // Brand colors
    primary: '#648286',
    secondary: '#757575',
    accent: '#648286',
    
    // Status colors
    success: '#4CAF50',
    error: '#B00020',
    warning: '#FB8C00',
    info: '#648286',
    
    // Neutral colors
    gray: '#8F95B2',
    lightGray: '#EBEDF2',
    mediumGray: '#C7C9D9',
    darkGray: '#646A86',
    
    // Shadows
    shadowColor: '#000',
    
    // Additional colors
    disabled: '#E0E0E0',
    placeholder: '#9E9E9E',
  },
  dark: {
    // Base colors
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    
    // UI elements
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
    separator: '#333',
    cardBackground: '#121212',
    
    // Brand colors
    primary: '#648286',
    secondary: '#9E9E9E',
    accent: '#648286',
    
    // Status colors
    success: '#4CAF50',
    error: '#CF6679',
    warning: '#FB8C00',
    info: '#648286',
    
    // Neutral colors
    gray: '#8E93A8',
    lightGray: '#2D3446',
    mediumGray: '#4D5673',
    darkGray: '#BEC1CF',
    
    // Shadows
    shadowColor: '#000',
    
    // Additional colors
    disabled: '#424242',
    placeholder: '#757575',
  },
};

export default Colors;

export function useThemeColor(
  scheme: ColorSchemeName,
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
) {
  return Colors[scheme === 'dark' ? 'dark' : 'light'][colorName];
}
