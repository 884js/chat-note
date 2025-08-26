import { X } from '@tamagui/lucide-icons';
import { memo } from 'react';
import { Button, Image, YStack } from 'tamagui';

interface ImagePreviewProps {
  imageUri: string;
  onRemove: () => void;
  size?: number;
}

export const ImagePreview = memo(function ImagePreview({
  imageUri,
  onRemove,
  size = 80,
}: ImagePreviewProps) {
  return (
    <YStack
      bg="$color2"
      rounded="$3"
      overflow="hidden"
      position="relative"
      width={size}
      height={size}
      borderWidth={1}
      borderColor="$color6"
      animation="quick"
      enterStyle={{ scale: 0.9, opacity: 0 }}
      scale={1}
      opacity={1}
    >
      {/* 画像プレビュー */}
      <Image
        source={{ uri: imageUri }}
        width="100%"
        height="100%"
        objectFit="cover"
      />

      {/* 削除ボタン */}
      <YStack position="absolute" style={{ top: -4, right: -4, zIndex: 10 }}>
        <Button
          size="$2"
          icon={X}
          onPress={onRemove}
          circular
          bg="$color10"
          borderWidth={2}
          borderColor="$background"
          pressStyle={{ scale: 0.9 }}
          animation="quick"
        />
      </YStack>
    </YStack>
  );
});
