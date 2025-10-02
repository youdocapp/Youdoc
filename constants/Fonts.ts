export const FONTS = {
  extraLight: 'ReadexPro_200ExtraLight',
  light: 'ReadexPro_300Light',
  regular: 'ReadexPro_400Regular',
  medium: 'ReadexPro_500Medium',
  semiBold: 'ReadexPro_600SemiBold',
  bold: 'ReadexPro_700Bold',
} as const;

export type FontFamily = typeof FONTS[keyof typeof FONTS];
