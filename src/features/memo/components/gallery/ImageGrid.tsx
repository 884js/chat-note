import { FlashList } from '@shopify/flash-list';
import { memo, useCallback, useMemo } from 'react';
import { Dimensions, Platform } from 'react-native';
import { Spinner, Text, YStack } from 'tamagui';
import type { GalleryGridProps, GalleryImage } from '../../types/gallery';
import { ImageThumbnail } from './ImageThumbnail';

const { width: screenWidth } = Dimensions.get('window');

export const ImageGrid = memo(function ImageGrid({
  images,
  onImagePress,
  numColumns = 3,
  isLoading = false,
  onLoadMore,
}: GalleryGridProps) {
  // グリッドアイテムのサイズを計算
  const itemSize = useMemo(() => {
    const spacing = 1;
    const totalSpacing = spacing * (numColumns + 1);
    return (screenWidth - totalSpacing) / numColumns;
  }, [numColumns]);

  // レンダーアイテム
  const renderItem = useCallback(
    ({ item, index }: { item: GalleryImage; index: number }) => {
      return (
        <ImageThumbnail
          image={item}
          size={itemSize}
          index={index}
          onPress={() => onImagePress(index)}
        />
      );
    },
    [itemSize, onImagePress],
  );

  // キー抽出
  const keyExtractor = useCallback((item: GalleryImage) => item.id, []);

  // アイテムの高さを推定
  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: itemSize,
      offset: itemSize * Math.floor(index / numColumns),
      index,
    }),
    [itemSize, numColumns],
  );

  // フッター（ローディング表示）
  const ListFooterComponent = useCallback(() => {
    if (!isLoading) return null;
    return (
      <YStack p="$4" items="center">
        <Spinner size="small" />
      </YStack>
    );
  }, [isLoading]);

  // 空の状態
  const ListEmptyComponent = useCallback(() => {
    if (isLoading) return null;
    return (
      <YStack flex={1} justify="center" items="center" p="$8">
        <Text fontSize="$5" color="$color8" style={{ textAlign: 'center' }}>
          画像がありません
        </Text>
        <Text
          fontSize="$3"
          color="$color7"
          style={{ textAlign: 'center' }}
          mt="$2"
        >
          写真を追加してメモを作成しましょう
        </Text>
      </YStack>
    );
  }, [isLoading]);

  return (
    <YStack flex={1} bg="$background">
      <FlashList
        data={images}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={numColumns}
        estimatedItemSize={itemSize}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={ListEmptyComponent}
        showsVerticalScrollIndicator={Platform.OS !== 'ios'}
        contentContainerStyle={{
          paddingBottom: 20,
        }}
        ItemSeparatorComponent={() => <YStack height={1} />}
      />
    </YStack>
  );
});
