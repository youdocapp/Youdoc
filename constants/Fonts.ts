export const FONTS = {
  medium: 'ReadexPro-Medium',
} as const;

export type FontFamily = typeof FONTS[keyof typeof FONTS];
