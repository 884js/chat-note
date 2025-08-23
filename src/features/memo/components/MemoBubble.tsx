import { memo } from 'react';
import { YStack, XStack, Text, Paragraph, Image } from 'tamagui';
import { TouchableOpacity } from 'react-native';
import { Clock, Edit3, Trash2 } from '@tamagui/lucide-icons';
import { formatTime } from '@/lib/dateUtils';
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

  if (memo.isDeleted) {
    return (
      <XStack py="$1.5" px="$4" opacity={0.5}>
        <YStack
          bg="$color2"
          rounded="$4"
          p="$3"
          maxW="80%"
          borderWidth={1}
          borderColor="$color4"
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
          borderColor="$color4"
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
              <Paragraph
                fontSize="$4"
                color="$color12"
                lineHeight="$5"
                fontWeight="400"
                letterSpacing={0.2}
              >
                {memo.content}
              </Paragraph>
            )}

            {/* メタ情報セクション */}
            <XStack items="center" gap="$2" mt="$2">
              <XStack items="center" gap="$1">
                <Clock size="$0.5" color="$color8" />
                <Text fontSize="$2" color="$color8" fontWeight="400">
                  {formatTime(memo.createdAt)}
                </Text>
              </XStack>

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
