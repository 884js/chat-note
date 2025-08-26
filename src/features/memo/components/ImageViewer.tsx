import { X } from '@tamagui/lucide-icons';
import { memo } from 'react';
import { Modal, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Image, View, YStack } from 'tamagui';

interface ImageViewerProps {
  imageUri: string | null;
  isVisible: boolean;
  onClose: () => void;
}

export const ImageViewer = memo(function ImageViewer({
  imageUri,
  isVisible,
  onClose,
}: ImageViewerProps) {
  const insets = useSafeAreaInsets();

  if (!imageUri) return null;

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <YStack flex={1} bg="rgba(0,0,0,0.9)" items="center" justify="center">
        {/* 閉じるボタン */}
        <View
          position="absolute"
          style={{
            top: insets.top + 16,
            right: 16,
            zIndex: 10,
          }}
        >
          <Button
            icon={X}
            size="$4"
            circular
            bg="rgba(255,255,255,0.2)"
            onPress={onClose}
            pressStyle={{ scale: 0.9 }}
          />
        </View>

        {/* 画像 */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={onClose}
          style={{ flex: 1, width: '100%', justifyContent: 'center' }}
        >
          <Image
            source={{ uri: imageUri }}
            width="100%"
            height="100%"
            objectFit="contain"
          />
        </TouchableOpacity>
      </YStack>
    </Modal>
  );
});
