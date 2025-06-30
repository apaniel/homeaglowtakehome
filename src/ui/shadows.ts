export const primitive = {
  '100': '0px 1px 2px 0px rgba(0, 0, 0, 0.08)',
  '100-top': '0px -1px 2px 0px rgba(0, 0, 0, 0.08)',
  '200': '0px 4px 8px 0px rgba(0, 0, 0, 0.06)',
  '200-top': '0px -4px 8px 0px rgba(0, 0, 0, 0.06)',
  '300': '0px 6px 12px 0px rgba(0, 0, 0, 0.06)',
  '300-top': '0px -6px 12px 0px rgba(0, 0, 0, 0.06)',
  '400': '0px 16px 32px 0px rgba(0, 0, 0, 0.06)',
  '400-top': '0px -16px 32px 0px rgba(0, 0, 0, 0.06)',
  '500': '0px 24px 40px 0px rgba(0, 0, 0, 0.08)',
  '500-top': '0px -24px 40px 0px rgba(0, 0, 0, 0.08)',
  '600': '0px 24px 48px -12px rgba(0, 0, 0, 0.12)',
  '600-top': '0px -24px 48px -12px rgba(0, 0, 0, 0.12)',
} as const;

export const semantic = {
  raised: primitive['200'],
  'raised-top': primitive['200-top'],
  floating: primitive['400'],
  'floating-top': primitive['400-top'],
  popout: primitive['600'],
  'popout-top': primitive['600-top'],
};
