import { formatTime } from '@/lib/dateUtils';
import { Edit3, Trash2 } from '@tamagui/lucide-icons';
import { memo } from 'react';
import { Alert, Linking, TouchableOpacity } from 'react-native';
import ParsedText from 'react-native-parsed-text';
import { Image, Text, XStack, YStack } from 'tamagui';
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
          bg="$color2"
          rounded="$4"
          p="$3"
          maxW="80%"
          borderWidth={1}
          borderColor="$color6"
          borderStyle="dashed"
          opacity={0.7}
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
          bg="$color2"
          rounded="$4"
          overflow="hidden"
          borderWidth={1}
          borderColor="$color6"
        >
          {/* 画像セクション */}
          {memo.imageUri && (
            <TouchableOpacity onPress={handleImagePress} activeOpacity={0.95}>
              <Image
                source={{ uri: memo.imageUri }}
                width="100%"
                height={200}
                objectFit="cover"
              />
            </TouchableOpacity>
          )}

          {/* コンテンツセクション */}
          <YStack p="$3" gap="$2">
            {memo.content && (
              <ParsedText
                style={{
                  fontSize: 16,
                  lineHeight: 24,
                  color: '#000',
                  letterSpacing: 0.2,
                }}
                parse={[
                  {
                    type: 'url',
                    style: {
                      color: '#007AFF',
                      textDecorationLine: 'underline',
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
              <Text fontSize="$2" color="$color8" fontWeight="400">
                {formatTime(memo.createdAt)}
              </Text>

              {memo.updatedAt > memo.createdAt && (
                <>
                  <Text fontSize="$2" color="$color7">
                    ·
                  </Text>
                  <XStack items="center" gap="$0.5">
                    <Edit3 size="$0.5" color="$color8" />
                    <Text fontSize="$2" color="$color8" fontWeight="400">
                      編集済み
                    </Text>
                  </XStack>
                </>
              )}
            </XStack>
          </YStack>
        </YStack>
      </XStack>
    </TouchableOpacity>
  );
});
