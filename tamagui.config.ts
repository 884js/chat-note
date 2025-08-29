import { defaultConfig } from '@tamagui/config/v4';
import { createTamagui } from 'tamagui';
import { themes } from './src/theme/themes';
import { fonts } from './src/theme/fonts';

export const tamaguiConfig = createTamagui({
  ...defaultConfig,
  themes,
  fonts,
  defaultFont: 'body',
});

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
