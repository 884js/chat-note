import { colors } from './colors';

// ベースとなるライトテーマ
export const lightTheme = {
  background: colors.background.light.primary,
  backgroundHover: colors.background.light.secondary,
  backgroundPress: colors.background.light.tertiary,
  backgroundFocus: colors.background.light.secondary,
  backgroundStrong: colors.background.light.primary,
  backgroundTransparent: 'rgba(255, 255, 255, 0)',

  color: colors.text.light.primary,
  colorHover: colors.text.light.primary,
  colorPress: colors.text.light.primary,
  colorFocus: colors.text.light.primary,
  colorTransparent: 'rgba(0, 0, 0, 0)',

  borderColor: colors.border.light,
  borderColorHover: colors.primary[300],
  borderColorPress: colors.primary[400],
  borderColorFocus: colors.primary[500],

  shadowColor: colors.shadow.light,
  shadowColorHover: colors.shadow.light,
  shadowColorPress: colors.shadow.light,
  shadowColorFocus: colors.shadow.light,

  // カスタムカラートークン
  color1: colors.background.light.primary,
  color2: colors.background.light.secondary,
  color3: colors.background.light.tertiary,
  color4: colors.border.light,
  color5: colors.secondary[200],
  color6: colors.secondary[300],
  color7: colors.secondary[400],
  color8: colors.secondary[500],
  color9: colors.secondary[600],
  color10: colors.text.light.tertiary,
  color11: colors.text.light.secondary,
  color12: colors.text.light.primary,

  // プライマリカラー
  primary: colors.primary[600],
  primaryLight: colors.primary[100],
  primaryDark: colors.primary[800],

  // セカンダリカラー
  secondary: colors.secondary[500],
  secondaryLight: colors.secondary[100],
  secondaryDark: colors.secondary[800],

  // アクセントカラー
  accent: colors.accent[500],
  accentLight: colors.accent[100],
  accentDark: colors.accent[800],

  // システムカラー
  success: colors.system.success,
  warning: colors.system.warning,
  error: colors.system.error,
  info: colors.system.info,

  // ブルーカラー（既存互換性のため）
  blue1: colors.primary[50],
  blue2: colors.primary[100],
  blue3: colors.primary[200],
  blue4: colors.primary[300],
  blue5: colors.primary[400],
  blue6: colors.primary[500],
  blue7: colors.primary[600],
  blue8: colors.primary[700],
  blue9: colors.primary[800],
  blue10: colors.primary[600],
  blue11: colors.primary[700],
  blue12: colors.primary[900],
};

// ダークテーマ
export const darkTheme = {
  background: colors.background.dark.primary,
  backgroundHover: colors.background.dark.secondary,
  backgroundPress: colors.background.dark.tertiary,
  backgroundFocus: colors.background.dark.secondary,
  backgroundStrong: colors.background.dark.primary,
  backgroundTransparent: 'rgba(0, 0, 0, 0)',

  color: colors.text.dark.primary,
  colorHover: colors.text.dark.primary,
  colorPress: colors.text.dark.primary,
  colorFocus: colors.text.dark.primary,
  colorTransparent: 'rgba(255, 255, 255, 0)',

  borderColor: colors.border.dark,
  borderColorHover: colors.primary[600],
  borderColorPress: colors.primary[500],
  borderColorFocus: colors.primary[400],

  shadowColor: colors.shadow.dark,
  shadowColorHover: colors.shadow.dark,
  shadowColorPress: colors.shadow.dark,
  shadowColorFocus: colors.shadow.dark,

  // カスタムカラートークン（ダークモード）
  color1: colors.background.dark.primary,
  color2: colors.background.dark.secondary,
  color3: colors.background.dark.tertiary,
  color4: colors.border.dark,
  color5: colors.secondary[800],
  color6: colors.secondary[700],
  color7: colors.secondary[600],
  color8: colors.secondary[500],
  color9: colors.secondary[400],
  color10: colors.text.dark.tertiary,
  color11: colors.text.dark.secondary,
  color12: colors.text.dark.primary,

  // プライマリカラー（ダークモード）
  primary: colors.primary[500],
  primaryLight: colors.primary[800],
  primaryDark: colors.primary[200],

  // セカンダリカラー（ダークモード）
  secondary: colors.secondary[400],
  secondaryLight: colors.secondary[800],
  secondaryDark: colors.secondary[200],

  // アクセントカラー（ダークモード）
  accent: colors.accent[400],
  accentLight: colors.accent[800],
  accentDark: colors.accent[200],

  // システムカラー（ダークモードでも同じ）
  success: colors.system.success,
  warning: colors.system.warning,
  error: colors.system.error,
  info: colors.system.info,

  // ブルーカラー（ダークモード）
  blue1: colors.primary[900],
  blue2: colors.primary[800],
  blue3: colors.primary[700],
  blue4: colors.primary[600],
  blue5: colors.primary[500],
  blue6: colors.primary[400],
  blue7: colors.primary[300],
  blue8: colors.primary[200],
  blue9: colors.primary[100],
  blue10: colors.primary[400],
  blue11: colors.primary[300],
  blue12: colors.primary[50],
};

// ルームテーマの生成
export const createRoomThemes = () => {
  const roomThemes: Record<string, any> = {};

  for (const [colorName, colorValues] of Object.entries(colors.roomColors)) {
    // ライトテーマ版
    roomThemes[`light_${colorName}`] = {
      ...lightTheme,
      primary: colorValues.main,
      primaryLight: colorValues.light,
      primaryDark: colorValues.dark,
      color5: colorValues.light,
      borderColorHover: colorValues.main,
      borderColorFocus: colorValues.dark,
    };

    // ダークテーマ版
    roomThemes[`dark_${colorName}`] = {
      ...darkTheme,
      primary: colorValues.main,
      primaryLight: colorValues.dark,
      primaryDark: colorValues.light,
      color5: colorValues.dark,
      borderColorHover: colorValues.main,
      borderColorFocus: colorValues.light,
    };
  }

  return roomThemes;
};

// すべてのテーマをエクスポート
export const themes = {
  light: lightTheme,
  dark: darkTheme,
  ...createRoomThemes(),
};
