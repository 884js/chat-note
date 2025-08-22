import { memo } from 'react';
import { YStack, XStack, Text, Paragraph, Image } from 'tamagui';
import { TouchableOpacity } from 'react-native';
import { Clock, Edit3, Trash2 } from '@tamagui/lucide-icons';
import { formatTime } from '@/lib/dateUtils';
import type { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  onLongPress?: (message: Message) => void;
  onImagePress?: (imageUri: string) => void;
}

export const MessageBubble = memo(function MessageBubble({
  message,
  onLongPress,
  onImagePress,
}: MessageBubbleProps) {
  const handleLongPress = () => {
    if (onLongPress && !message.isDeleted) {
      onLongPress(message);
    }
  };

  const handleImagePress = () => {
    if (onImagePress && message.imageUri) {
      onImagePress(message.imageUri);
    }
  };

  if (message.isDeleted) {
    return (
      <XStack py="$1.5" px="$4" opacity={0.5}>
        <YStack
          bg="$color1"
          rounded="$5"
          p="$3"
          maxW="80%"
          borderWidth={1}
          borderColor="$color3"
          borderStyle="dashed"
          opacity={0.7}
        >
          <XStack items="center" gap="$2">
            <Trash2 size="$1" color="$color8" />
            <Text fontSize="$3" fontStyle="italic" color="$color8">
              このメッセージは削除されました
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
          bg="$color1"
          rounded="$4"
          overflow="hidden"
          // 柔らかい影
          shadowColor="$shadowColor"
          shadowOpacity={0.06}
          shadowRadius={12}
          shadowOffset={{ width: 0, height: 3 }}
          elevationAndroid={1}
          borderWidth={0.5}
          borderColor="$color3"
        >
          {/* 画像セクション */}
          {message.imageUri && (
            <TouchableOpacity onPress={handleImagePress} activeOpacity={0.95}>
              <Image
                source={{ uri: message.imageUri }}
                width="100%"
                height={200}
                objectFit="cover"
              />
            </TouchableOpacity>
          )}

          {/* コンテンツセクション */}
          <YStack p="$3" gap="$2">
            {message.content && (
              <Paragraph
                fontSize="$4"
                color="$color12"
                lineHeight="$5"
                fontWeight="400"
                letterSpacing={0.2}
              >
                {message.content}
              </Paragraph>
            )}

            {/* メタ情報セクション */}
            <XStack items="center" gap="$2" mt="$2">
              <XStack items="center" gap="$1">
                <Clock size="$0.5" color="$color8" />
                <Text fontSize="$2" color="$color8" fontWeight="400">
                  {formatTime(message.createdAt)}
                </Text>
              </XStack>

              {message.updatedAt > message.createdAt && (
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
