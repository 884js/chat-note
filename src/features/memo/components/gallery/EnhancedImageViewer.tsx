import { formatTime } from '@/lib/dateUtils';
import { X } from '@tamagui/lucide-icons';
import { memo, useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Modal,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Image, Text, View, XStack, YStack } from 'tamagui';
import type { GalleryImage, GalleryViewerProps } from '../../types/gallery';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const EnhancedImageViewer = memo(function EnhancedImageViewer({
  images,
  initialIndex,
  isVisible,
  onClose,
}: GalleryViewerProps) {
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList<GalleryImage>>(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const opacity = useSharedValue(1);

  // インデックス変更時の処理
  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const newIndex = Math.round(
        event.nativeEvent.contentOffset.x / screenWidth,
      );
      setCurrentIndex(newIndex);
    },
    [],
  );

  // 画像レンダリング
  const renderImage = useCallback(
    ({ item }: { item: GalleryImage }) => {
      return (
        <View width={screenWidth} height={screenHeight} justify="center">
          <TouchableOpacity
            activeOpacity={0.95}
            onPress={() => {
              opacity.value = withSpring(opacity.value === 1 ? 0 : 1);
            }}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <Image
              source={{ uri: item.uri }}
              width={screenWidth}
              height={screenHeight * 0.7}
              objectFit="contain"
            />
          </TouchableOpacity>
        </View>
      );
    },
    [opacity],
  );

  // ヘッダーアニメーション
  const headerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  // フッターアニメーション
  const footerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const currentImage = images[currentIndex];

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <YStack flex={1} bg="rgba(0,0,0,1)">
        {/* 画像スライダー */}
        <FlatList
          ref={flatListRef}
          data={images}
          renderItem={renderImage}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          initialScrollIndex={initialIndex}
          getItemLayout={(_, index) => ({
            length: screenWidth,
            offset: screenWidth * index,
            index,
          })}
        />

        {/* ヘッダー */}
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              paddingTop: insets.top,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 10,
            },
            headerStyle,
          ]}
        >
          <XStack p="$4" items="center" justify="space-between">
            <YStack flex={1}>
              <Text fontSize="$4" color="white" fontWeight="600">
                {currentIndex + 1} / {images.length}
              </Text>
              <Text fontSize="$2" color="rgba(255,255,255,0.8)">
                {formatTime(currentImage.date)}
              </Text>
            </YStack>
            <Button
              icon={X}
              size="$4"
              circular
              bg="rgba(255,255,255,0.2)"
              onPress={onClose}
              pressStyle={{ scale: 0.9 }}
            />
          </XStack>
        </Animated.View>

        {/* フッター（メモ内容） */}
        {currentImage.content && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={[
              {
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                paddingBottom: insets.bottom + 20,
                backgroundColor: 'rgba(0,0,0,0.7)',
                zIndex: 10,
              },
              footerStyle,
            ]}
          >
            <YStack p="$4">
              <Text
                fontSize="$3"
                color="white"
                numberOfLines={3}
                ellipsizeMode="tail"
              >
                {currentImage.content}
              </Text>
            </YStack>
          </Animated.View>
        )}

        {/* インジケーター */}
        <View
          position="absolute"
          style={{ bottom: 100, left: 0, right: 0, zIndex: 10 }}
        >
          <XStack justify="center" gap="$1" p="$2">
            {images.map((img, index) => (
              <View
                key={img.id}
                width={6}
                height={6}
                rounded={3}
                bg={index === currentIndex ? 'white' : 'rgba(255,255,255,0.3)'}
              />
            ))}
          </XStack>
        </View>
      </YStack>
    </Modal>
  );
});
