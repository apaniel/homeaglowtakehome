export const screens = {
  sm: '320px',
  md: '768px',
  lg: '1280px',
  xl: '1440px',
} as const;

export type Screens = keyof typeof screens;
