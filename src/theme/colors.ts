export const colors = {
  // ブランドカラー
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6', // メインのプライマリカラー（アクセントカラー）
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
    950: '#172554',
  },

  // セカンダリカラー（ダークグレー）
  secondary: {
    50: '#F5F6F7',
    100: '#EBEDEF',
    200: '#D6DADF',
    300: '#B8BFC6',
    400: '#9AA4AD',
    500: '#7C8993',
    600: '#58636B', // メインのセカンダリカラー（ダークグレー）
    700: '#4A545B',
    800: '#3C444A',
    900: '#2E353A',
    950: '#1F2529',
  },

  // アクセントカラー（アンバー）
  accent: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B', // メインのアクセントカラー
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
    950: '#451A03',
  },

  // ルーム用カラーパレット
  roomColors: {
    blue: {
      light: '#DBEAFE',
      main: '#3B82F6',
      dark: '#1E40AF',
    },
    green: {
      light: '#D1FAE5',
      main: '#10B981',
      dark: '#065F46',
    },
    purple: {
      light: '#EDE9FE',
      main: '#8B5CF6',
      dark: '#5B21B6',
    },
    orange: {
      light: '#FED7AA',
      main: '#FB923C',
      dark: '#C2410C',
    },
    pink: {
      light: '#FCE7F3',
      main: '#EC4899',
      dark: '#9F1239',
    },
    yellow: {
      light: '#FEF3C7',
      main: '#FDE047',
      dark: '#A16207',
    },
    cyan: {
      light: '#CFFAFE',
      main: '#06B6D4',
      dark: '#155E75',
    },
    indigo: {
      light: '#E0E7FF',
      main: '#6366F1',
      dark: '#3730A3',
    },
    red: {
      light: '#FEE2E2',
      main: '#EF4444',
      dark: '#991B1B',
    },
    gray: {
      light: '#EBEDEF',
      main: '#58636B',
      dark: '#3C444A',
    },
  },

  // システムカラー
  system: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#F43F5E',
    info: '#3B82F6',
  },

  // 背景色
  background: {
    light: {
      primary: '#FFFFFF',
      secondary: '#FAFAFA',
      tertiary: '#F5F5F5',
    },
    dark: {
      primary: '#0F172A',
      secondary: '#1E293B',
      tertiary: '#334155',
    },
  },

  // テキストカラー
  text: {
    light: {
      primary: '#0F172A',
      secondary: '#475569',
      tertiary: '#94A3B8',
      disabled: '#CBD5E1',
    },
    dark: {
      primary: '#F8FAFC',
      secondary: '#E2E8F0',
      tertiary: '#94A3B8',
      disabled: '#475569',
    },
  },

  // ボーダーカラー
  border: {
    light: '#E2E8F0',
    dark: '#334155',
  },

  // 影
  shadow: {
    light: 'rgba(0, 0, 0, 0.1)',
    dark: 'rgba(0, 0, 0, 0.3)',
  },
};

// カラーネームの型定義
export type RoomColorName = keyof typeof colors.roomColors;
export type SystemColorName = keyof typeof colors.system;
