import '../../tamagui-web.css';

import { DatabaseProvider } from '@/lib/database';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { TamaguiProvider } from 'tamagui';
import { PortalProvider } from "@tamagui/portal";
import tamaguiConfig from '../../tamagui.config';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5分
    },
  },
});

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
    <QueryClientProvider client={queryClient}>
      <DatabaseProvider seedData={__DEV__}>
        <KeyboardProvider>
          <TamaguiProvider config={tamaguiConfig}>
            <PortalProvider>
              <ThemeProvider
                value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
              >
                <StatusBar style="auto" />
                <StackList />
              </ThemeProvider>
            </PortalProvider>
          </TamaguiProvider>
        </KeyboardProvider>
      </DatabaseProvider>
    </QueryClientProvider>
  );
}

const StackList = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "メモ一覧" }} />
      <Stack.Screen
        name="group/[id]"
        options={{
          headerShown: false,
          presentation: "card",
        }}
      />
    </Stack>
  );
};