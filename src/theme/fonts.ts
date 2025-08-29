import { createInterFont } from '@tamagui/font-inter';
import { createFont } from '@tamagui/core';

// デフォルトのInterフォント
const interFont = createInterFont();

// M PLUS Rounded 1c フォント設定
const mplusRoundedFont = createFont({
  family: 'MPLUSRounded',
  size: {
    1: 11,
    2: 12,
    3: 13,
    4: 14,
    5: 16,
    6: 18,
    7: 20,
    8: 22,
    9: 30,
    10: 46,
    11: 55,
    12: 62,
    13: 72,
    14: 92,
    15: 114,
    16: 134,
  },
  lineHeight: {
    1: 17,
    2: 22,
    3: 25,
    4: 27,
    5: 29,
    6: 31,
    7: 33,
    8: 36,
    9: 43,
    10: 57,
    11: 64,
    12: 71,
    13: 81,
    14: 101,
    15: 124,
    16: 147,
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
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0.15,
    6: 0.15,
    7: 0.15,
    8: 0.15,
    9: 0,
    10: -0.5,
    11: -0.5,
    12: -0.5,
    13: -0.5,
    14: -0.5,
    15: -0.5,
    16: -0.5,
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
    5: 20,
    6: 24,
    7: 30,
    8: 36,
    9: 48,
    10: 60,
  },
});

export const fonts = {
  heading: headingFont,
  body: mplusRoundedFont,
  mono: interFont,
};