import {
  ArrowLeft,
  Bell,
  ChevronRight,
  Database,
  HelpCircle,
  Info,
  Lock,
  Palette,
} from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import type { ReactElement } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Button,
  Card,
  ListItem,
  ScrollView,
  Text,
  XStack,
  YGroup,
  YStack,
} from 'tamagui';

interface SettingMenuItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: ReactElement;
  onPress: () => void;
  disabled?: boolean;
  badge?: string;
}

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    router.back();
  };

  const handleBackupPress = () => {
    router.push('/settings/backup');
  };

  const handleComingSoon = (feature: string) => {
    // 将来実装予定の機能のプレースホルダー
    console.log(`${feature} - Coming soon`);
  };

  const menuItems: SettingMenuItem[] = [
    {
      id: 'backup',
      title: 'バックアップ',
      subtitle: 'データのエクスポート・インポート',
      icon: <Database size={20} />,
      onPress: handleBackupPress,
    },
    {
      id: 'theme',
      title: 'テーマ',
      subtitle: '外観のカスタマイズ',
      icon: <Palette size={20} />,
      onPress: () => handleComingSoon('テーマ'),
      disabled: true,
      badge: '準備中',
    },
    {
      id: 'notification',
      title: '通知',
      subtitle: 'リマインダーの設定',
      icon: <Bell size={20} />,
      onPress: () => handleComingSoon('通知'),
      disabled: true,
      badge: '準備中',
    },
    {
      id: 'privacy',
      title: 'プライバシー',
      subtitle: 'セキュリティとロック',
      icon: <Lock size={20} />,
      onPress: () => handleComingSoon('プライバシー'),
      disabled: true,
      badge: '準備中',
    },
  ];

  return (
    <YStack flex={1} bg="$background">
      {/* ヘッダー */}
      <XStack
        pt={insets.top}
        pb="$3"
        px="$4"
        bg="$color3"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
        gap="$3"
      >
        <Button
          size="$3"
          chromeless
          icon={<ArrowLeft size={24} />}
          onPress={handleBack}
        />
        <Text fontSize="$6" fontWeight="bold" flex={1}>
          設定
        </Text>
      </XStack>

      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <YStack p="$4" gap="$4">
          {/* 設定メニュー */}
          <YGroup bordered>
            {menuItems.map((item) => (
              <YGroup.Item key={item.id}>
                <ListItem
                  hoverTheme
                  pressTheme
                  title={item.title}
                  subTitle={item.subtitle}
                  icon={item.icon}
                  iconAfter={
                    item.badge ? (
                      <XStack bg="$color5" px="$2" py="$0.5">
                        <Text fontSize="$1" color="$color10">
                          {item.badge}
                        </Text>
                      </XStack>
                    ) : (
                      <ChevronRight size={20} color="$color10" />
                    )
                  }
                  onPress={item.onPress}
                  disabled={item.disabled}
                  opacity={item.disabled ? 0.5 : 1}
                  bg="$background"
                  py="$3"
                />
              </YGroup.Item>
            ))}
          </YGroup>

          {/* アプリ情報 */}
          <Card p="$4" bordered>
            <YStack gap="$3">
              <XStack gap="$2">
                <Info size={20} color="$color11" />
                <Text fontSize="$4" fontWeight="bold">
                  アプリ情報
                </Text>
              </XStack>
              <YStack gap="$1">
                <Text fontSize="$2" color="$color10">
                  Memoly
                </Text>
                <Text fontSize="$2" color="$color10">
                  バージョン: 1.0.0
                </Text>
                <Text fontSize="$2" color="$color10">
                  © 2025 Memoly
                </Text>
              </YStack>
            </YStack>
          </Card>

          {/* ヘルプとサポート */}
          <Card p="$4" bordered>
            <YStack gap="$3">
              <XStack gap="$2">
                <HelpCircle size={20} color="$color11" />
                <Text fontSize="$4" fontWeight="bold">
                  ヘルプとサポート
                </Text>
              </XStack>
              <YStack gap="$2">
                <Button
                  size="$3"
                  variant="outlined"
                  onPress={() => handleComingSoon('利用規約')}
                  disabled
                >
                  利用規約
                </Button>
                <Button
                  size="$3"
                  variant="outlined"
                  onPress={() => handleComingSoon('プライバシーポリシー')}
                  disabled
                >
                  プライバシーポリシー
                </Button>
                <Button
                  size="$3"
                  variant="outlined"
                  onPress={() => handleComingSoon('お問い合わせ')}
                  disabled
                >
                  お問い合わせ
                </Button>
              </YStack>
            </YStack>
          </Card>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
