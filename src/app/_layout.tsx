import '../../tamagui-web.css';

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { TamaguiProvider } from 'tamagui';
import { useFonts } from 'expo-font';
import tamaguiConfig from '../../tamagui.config';
import { useEffect } from 'react';
import { KeyboardProvider } from "react-native-keyboard-controller";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, error] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

    useEffect(() => {
      if (fontsLoaded) {
        SplashScreen.hideAsync();
      }
    }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  if (!colorScheme) {
    return null;
  }

  return (
    <KeyboardProvider>
      <TamaguiProvider config={tamaguiConfig}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <StatusBar style="auto" />
          <Stack>
            <Stack.Screen name="index" options={{ title: "メモ一覧" }} />
            <Stack.Screen
              name="room/[id]"
              options={{
                headerShown: false,
                presentation: "card",
              }}
            />
          </Stack>
        </ThemeProvider>
      </TamaguiProvider>
    </KeyboardProvider>
  );
}
