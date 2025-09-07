import { formatTime } from '@/lib/dateUtils';
import { Trash2 } from '@tamagui/lucide-icons';
import { Image as ExpoImage } from 'expo-image';
import { memo } from 'react';
import { Alert, Linking, TouchableOpacity, useColorScheme } from 'react-native';
import ParsedText from 'react-native-parsed-text';
import { Text, XStack, YStack } from 'tamagui';
import type { Memo } from '../types';

interface MemoBubbleProps {
  memo: Memo;
  onLongPress?: (memo: Memo) => void;
  onImagePress?: (imageUri: string) => void;
}

export const MemoBubble = memo(function MemoBubble({
  memo,
  onLongPress,
  onImagePress,
}: MemoBubbleProps) {
  const colorScheme = useColorScheme();
  const handleLongPress = () => {
    if (onLongPress && !memo.isDeleted) {
      onLongPress(memo);
    }
  };

  const handleImagePress = () => {
    if (onImagePress && memo.imageUri) {
      onImagePress(memo.imageUri);
    }
  };

  const handleUrlPress = async (url: string) => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('エラー', 'このURLを開けません');
      }
    } catch (error) {
      Alert.alert('エラー', 'URLを開く際にエラーが発生しました');
    }
  };

  if (memo.isDeleted) {
    return (
      <XStack py="$1.5" px="$4" opacity={0.5}>
        <YStack
          bg="$background"
          rounded="$4"
          p="$3"
          maxW="80%"
          borderWidth={1}
          borderColor="$borderColor"
          borderStyle="dashed"
          opacity={0.6}
        >
          <XStack items="center" gap="$2">
            <Trash2 size="$1" color="$color8" />
            <Text fontSize="$3" fontStyle="italic" color="$color8">
              このメモは削除されました
            </Text>
          </XStack>
        </YStack>
      </XStack>
    );
  }

  return (
    <TouchableOpacity onLongPress={handleLongPress} activeOpacity={0.9}>
      <XStack px="$4" py="$1.5">
        <YStack
          maxW="80%"
          bg="$cardBackground"
          rounded="$4"
          overflow="hidden"
          shadowColor="$shadowColor"
          shadowRadius={4}
          shadowOffset={{ width: 0, height: 1 }}
          shadowOpacity={0.05}
          borderWidth={1}
          borderColor="$cardBorder"
          animation="quick"
          hoverStyle={{
            shadowOpacity: 0.08,
            borderColor: '$borderColorHover',
          }}
        >
          {/* 画像セクション */}
          {memo.imageUri && (
            <TouchableOpacity onPress={handleImagePress} activeOpacity={0.95}>
              <ExpoImage
                source={{ uri: memo.imageUri }}
                style={{
                  width: '100%',
                  aspectRatio: 4 / 3, // デフォルトのアスペクト比
                  maxHeight: 300, // 最大高さ制限
                }}
                contentFit="cover"
              />
            </TouchableOpacity>
          )}

          {/* コンテンツセクション */}
          <YStack p="$3" gap="$2">
            {memo.content && (
              <ParsedText
                style={{
                  fontSize: 15,
                  lineHeight: 22,
                  color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A',
                  letterSpacing: 0.15,
                  fontFamily: 'MPLUSRounded',
                }}
                parse={[
                  {
                    type: 'url',
                    style: {
                      color: colorScheme === 'dark' ? '#60A5FA' : '#3B82F6',
                      textDecorationLine: 'underline',
                      fontWeight: '500',
                    },
                    onPress: handleUrlPress,
                  },
                ]}
                childrenProps={{ allowFontScaling: false }}
              >
                {memo.content}
              </ParsedText>
            )}

            {/* メタ情報セクション - 右下配置 */}
            <XStack items="center" gap="$1.5" mt="$1" justify="flex-end">
              <Text
                fontSize="$1"
                color="$color10"
                fontWeight="500"
                opacity={0.7}
              >
                {formatTime(memo.createdAt)}
              </Text>
            </XStack>
          </YStack>
        </YStack>
      </XStack>
    </TouchableOpacity>
  );
});
