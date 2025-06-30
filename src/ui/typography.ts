import type { TextStyle } from 'react-native';
import { StyleSheet } from 'react-native';

import { semantic } from './colors';

export const fontFamily = 'Figtree';

export const baseHeadingStyles: TextStyle = {
  fontFamily,
  fontWeight: 600,
  color: semantic.text.primary,
} as const;

export const typographyWeights = StyleSheet.create({
  regular: { fontWeight: 400 },
  semibold: { fontWeight: 600 },
} as const);

export type TypographyWeights = keyof typeof typographyWeights;

export const headingStyles = StyleSheet.create({
  '4xl': {
    ...baseHeadingStyles,
    fontSize: 64,
    lineHeight: 76,
  },
  '3xl': {
    ...baseHeadingStyles,
    fontSize: 40,
    lineHeight: 48,
  },
  '2xl': {
    ...baseHeadingStyles,
    fontSize: 32,
    lineHeight: 40,
  },
  xl: {
    ...baseHeadingStyles,
    fontSize: 28,
    lineHeight: 36,
  },
  lg: {
    ...baseHeadingStyles,
    fontSize: 24,
    lineHeight: 32,
  },
  md: {
    ...baseHeadingStyles,
    fontSize: 20,
    lineHeight: 28,
  },
  sm: {
    ...baseHeadingStyles,
    fontSize: 18,
    lineHeight: 28,
  },
  xs: {
    ...baseHeadingStyles,
    fontSize: 13,
    lineHeight: 20,
  },
} as const);

export type HeadingLevels = keyof typeof headingStyles;

export const bodyStyles = StyleSheet.create({
  '4xl': {
    fontFamily,
    fontSize: 64,
    lineHeight: 76,
  },
  '3xl': {
    fontFamily,
    fontSize: 28,
    lineHeight: 36,
  },
  '2xl': {
    fontFamily,
    fontSize: 20,
    lineHeight: 28,
  },
  xl: {
    fontFamily,
    fontSize: 18,
    lineHeight: 28,
  },
  lg: {
    fontFamily,
    fontSize: 16,
    lineHeight: 24,
  },
  md: {
    fontFamily,
    fontSize: 14,
    lineHeight: 20,
  },
  sm: {
    fontFamily,
    fontSize: 13,
    lineHeight: 20,
  },
  xs: {
    fontFamily,
    fontSize: 12,
    lineHeight: 18,
  },
  xxs: {
    fontFamily,
    fontSize: 10,
    lineHeight: 12,
  },
} as const);

export type BodyLevels = keyof typeof bodyStyles;

export const captionStyles = StyleSheet.create({
  md: {
    fontFamily,
    fontSize: 12,
    lineHeight: 18,
  },
} as const);

export type CaptionLevels = keyof typeof captionStyles;
