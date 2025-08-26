import { memo } from 'react';
import { TouchableOpacity } from 'react-native';
import { Image, YStack } from 'tamagui';
import type { ThumbnailProps } from '../../types/gallery';

export const ImageThumbnail = memo(function ImageThumbnail({
  image,
  size,
  onPress,
  index,
}: ThumbnailProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <YStack
        width={size}
        height={size}
        bg="$color2"
        rounded="$2"
        overflow="hidden"
        borderWidth={0.5}
        borderColor="$color4"
        animation="quick"
        enterStyle={{ scale: 0.95, opacity: 0 }}
        scale={1}
        opacity={1}
      >
        <Image
          source={{ uri: image.uri }}
          width="100%"
          height="100%"
          objectFit="cover"
        />
      </YStack>
    </TouchableOpacity>
  );
});
