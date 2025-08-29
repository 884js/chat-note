import { Archive, Settings } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import { memo } from 'react';
import { Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatePresence, Button, Text, YStack } from 'tamagui';

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DrawerMenu = memo(function DrawerMenu({
  isOpen,
  onClose,
}: DrawerMenuProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleSettingsPress = () => {
    onClose();
    Alert.alert('設定', '設定画面は実装中です');
  };

  const handleArchivePress = () => {
    onClose();
    router.push('/archive');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* オーバーレイ */}
          <YStack
            position="absolute"
            t={0}
            l={0}
            r={0}
            b={0}
            bg="rgba(0,0,0,0.5)"
            z={99999}
            animation="quickest"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
            opacity={1}
            onPress={onClose}
          />

          {/* ドロワー本体 */}
          <YStack
            position="absolute"
            t={0}
            b={0}
            width="80%"
            bg="$background"
            z={100000}
            animation={{
              type: 'lazy',
            }}
            animateOnly={['transform']}
            enterStyle={{ x: -50 }}
            exitStyle={{ x: -350 }}
            x={0}
            shadowColor="$shadowColor"
            shadowOffset={{ width: 2, height: 0 }}
            shadowOpacity={0.25}
            shadowRadius={3.84}
            elevation={5}
          >
            {/* ドロワーヘッダー */}
            <YStack
              bg="$color3"
              pt={insets.top + 20}
              pb="$4"
              px="$4"
              borderBottomWidth={1}
              borderBottomColor="$color6"
            >
              <Text fontSize="$8" fontWeight="bold" color="$color12">
                ChatMemo
              </Text>
              <Text fontSize="$3" color="$color10" mt="$1">
                メニュー
              </Text>
            </YStack>

            {/* メニューアイテム */}
            <YStack flex={1} p="$3" gap="$2">
              <Button
                size="$4"
                justify="flex-start"
                chromeless
                icon={<Settings size={20} />}
                onPress={() => {
                  onClose();
                  Alert.alert('設定', '設定画面は実装中です');
                }}
              >
                設定
              </Button>

              <Button
                size="$4"
                justify="flex-start"
                chromeless
                icon={<Archive size={20} />}
                onPress={handleArchivePress}
              >
                アーカイブ
              </Button>
            </YStack>
          </YStack>
        </>
      )}
    </AnimatePresence>
  );
});
