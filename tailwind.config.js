import { borderRadius, borderWidth } from './src/ui/borders';
import { screens } from './src/ui/breakpoints';
import { semantic } from './src/ui/colors';
import { semantic as shadow } from './src/ui/shadows';
import { spacing } from './src/ui/spacing';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './App.tsx'],
  darkMode: 'class',
  safelist: [
    // Sizes
    ...Object.keys(spacing).map((key) => `p-${key}`),
    // Text colors
    ...Object.keys(semantic.text).map((key) => `text-text-${key}`),
    ...Object.keys(borderRadius).map((key) => `rounded-${key}`),
    ...Object.keys(borderWidth).map((key) => `border-${key}`),
    // Button colors
    ...Object.keys(semantic.button).map((key) => `bg-button-${key}`),
    ...Object.keys(semantic.button).map((key) => `enabled:hover:bg-button-${key}`),
    ...Object.keys(semantic.button).map((key) => `border-button-${key}`),
    // Fill
    ...Object.keys(semantic.fill).map((key) => `bg-fill-${key}`),
  ],
  theme: {
    colors: {
      ...semantic,
    },

    boxShadow: shadow,
    extend: {
      screens,
      fontFamily: {
        display: ['Figtree'],
        body: ['Figtree'],
      },
      spacing: spacing,
      borderRadius: borderRadius,
      borderWidth: borderWidth,
    },
  },
  presets: [require('nativewind/preset')],
};
