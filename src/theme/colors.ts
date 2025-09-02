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

  // アクセントカラー（エメラルド）
  accent: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981', // メインのアクセントカラー
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
    950: '#022C22',
  },

  // ルーム用カラーパレット（洗練されたカラーセット）
  roomColors: {
    ocean: {
      light: '#DBEAFE',
      main: '#3B82F6',
      dark: '#1E40AF',
      name: 'オーシャン',
    },
    emerald: {
      light: '#D1FAE5',
      main: '#10B981',
      dark: '#065F46',
      name: 'エメラルド',
    },
    violet: {
      light: '#EDE9FE',
      main: '#8B5CF6',
      dark: '#5B21B6',
      name: 'バイオレット',
    },
    sunset: {
      light: '#FED7AA',
      main: '#FB923C',
      dark: '#C2410C',
      name: 'サンセット',
    },
    rose: {
      light: '#FCE7F3',
      main: '#EC4899',
      dark: '#9F1239',
      name: 'ローズ',
    },
    amber: {
      light: '#FEF3C7',
      main: '#F59E0B',
      dark: '#92400E',
      name: 'アンバー',
    },
    sky: {
      light: '#E0F2FE',
      main: '#0EA5E9',
      dark: '#075985',
      name: 'スカイ',
    },
    crimson: {
      light: '#FEE2E2',
      main: '#DC2626',
      dark: '#991B1B',
      name: 'クリムゾン',
    },
    slate: {
      light: '#F1F5F9',
      main: '#64748B',
      dark: '#334155',
      name: 'スレート',
    },
    teal: {
      light: '#CCFBF1',
      main: '#14B8A6',
      dark: '#134E4A',
      name: 'ティール',
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
      secondary: '#F8FAFC',
      tertiary: '#F1F5F9',
      elevated: '#FFFFFF',
      overlay: 'rgba(0, 0, 0, 0.5)',
    },
    dark: {
      primary: '#0F172A',
      secondary: '#1E293B',
      tertiary: '#334155',
      elevated: '#1E293B',
      overlay: 'rgba(0, 0, 0, 0.7)',
    },
  },

  // テキストカラー
  text: {
    light: {
      primary: '#0F172A',
      secondary: '#475569',
      tertiary: '#64748B',
      disabled: '#CBD5E1',
      link: '#3B82F6',
      inverse: '#FFFFFF',
    },
    dark: {
      primary: '#F8FAFC',
      secondary: '#E2E8F0',
      tertiary: '#CBD5E1',
      disabled: '#64748B',
      link: '#60A5FA',
      inverse: '#0F172A',
    },
  },

  // ボーダーカラー
  border: {
    light: '#E2E8F0',
    dark: '#334155',
    focus: '#3B82F6',
    error: '#EF4444',
  },

  // 影
  shadow: {
    light: 'rgba(0, 0, 0, 0.05)',
    medium: 'rgba(0, 0, 0, 0.1)',
    dark: 'rgba(0, 0, 0, 0.2)',
    colored: 'rgba(59, 130, 246, 0.15)',
  },
};

// カラーネームの型定義
export type RoomColorName = keyof typeof colors.roomColors;
export type SystemColorName = keyof typeof colors.system;
