import { createFont } from '@tamagui/core';
import { createInterFont } from '@tamagui/font-inter';

// デフォルトのInterフォント
const interFont = createInterFont();

// M PLUS Rounded 1c フォント設定
const mplusRoundedFont = createFont({
  family: 'MPLUSRounded',
  size: {
    1: 10,
    2: 11,
    3: 12,
    4: 14,
    5: 16,
    6: 18,
    7: 20,
    8: 22,
    9: 28,
    10: 36,
    11: 46,
    12: 56,
    13: 68,
    14: 84,
    15: 102,
    16: 124,
  },
  lineHeight: {
    1: 15,
    2: 17,
    3: 19,
    4: 21,
    5: 24,
    6: 26,
    7: 28,
    8: 30,
    9: 36,
    10: 44,
    11: 54,
    12: 64,
    13: 76,
    14: 92,
    15: 110,
    16: 132,
  },
  weight: {
    1: '400',
    2: '400',
    3: '400',
    4: '400',
    5: '500',
    6: '500',
    7: '700',
    8: '700',
    9: '700',
    10: '700',
    11: '700',
    12: '700',
  },
  letterSpacing: {
    1: 0.1,
    2: 0.1,
    3: 0.1,
    4: 0.1,
    5: 0.15,
    6: 0.15,
    7: 0.2,
    8: 0.2,
    9: 0,
    10: -0.3,
    11: -0.4,
    12: -0.5,
    13: -0.6,
    14: -0.7,
    15: -0.8,
    16: -0.9,
  },
  face: {
    400: { normal: 'MPLUSRounded' },
    500: { normal: 'MPLUSRoundedMedium' },
    700: { normal: 'MPLUSRoundedBold' },
  },
});

// ヘッダーフォント（大きめのサイズ用）
const headingFont = createFont({
  ...mplusRoundedFont,
  size: {
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 40,
    10: 52,
  },
  lineHeight: {
    4: 22,
    5: 26,
    6: 30,
    7: 34,
    8: 38,
    9: 46,
    10: 58,
  },
  weight: {
    4: '600',
    5: '600', 
    6: '700',
    7: '700',
    8: '800',
    9: '800',
    10: '900',
  },
});

export const fonts = {
  heading: headingFont,
  body: mplusRoundedFont,
  mono: interFont,
};
