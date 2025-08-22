import { memo } from 'react';
import { YStack, XStack, Text, Paragraph, Image } from 'tamagui';
import { TouchableOpacity } from 'react-native';
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
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
      <XStack py="$2" px="$4" opacity={0.5}>
        <Text fontSize="$3" fontStyle="italic">
          このメッセージは削除されました
        </Text>
      </XStack>
    );
  }

  return (
    <TouchableOpacity onLongPress={handleLongPress} activeOpacity={0.7}>
      <XStack
        px="$4"
        py="$2"
        animation="quick"
        enterStyle={{ opacity: 0, x: -20 }}
        opacity={1}
        x={0}
      >
        <YStack
          background="$gray3"
          rounded="$4"
          p="$3"
          maxW="80%"
          gap="$2"
        >
          {message.imageUri && (
            <TouchableOpacity onPress={handleImagePress}>
              <Image
                source={{ uri: message.imageUri }}
                width={200}
                height={200}
                rounded="$3"
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}
          
          {message.content && (
            <Paragraph fontSize="$4" color="$color12">
              {message.content}
            </Paragraph>
          )}
          
          <XStack items="center" gap="$2">
            <Text fontSize="$2" color="$color10">
              {formatTime(message.createdAt)}
            </Text>
            {message.updatedAt > message.createdAt && (
              <Text fontSize="$2" color="$color10">
                (編集済み)
              </Text>
            )}
          </XStack>
        </YStack>
      </XStack>
    </TouchableOpacity>
  );
});