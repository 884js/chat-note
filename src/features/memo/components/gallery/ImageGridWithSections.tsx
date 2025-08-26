import { FlashList } from '@shopify/flash-list';
import { memo, useCallback, useMemo } from 'react';
import { Dimensions, Platform, View } from 'react-native';
import { Spinner, Text, XStack, YStack } from 'tamagui';
import { ERROR_MESSAGES, GALLERY_CONFIG } from '../../constants/gallery';
import type { Memo } from '../../types';
import type { FlatListItem, GalleryImage } from '../../types/gallery';
import {
  memosToGallerySections,
  sectionsToFlatList,
} from '../../types/gallery';
import { ImageThumbnail } from './ImageThumbnail';
import { SectionHeader } from './SectionHeader';

const { width: screenWidth } = Dimensions.get('window');

interface ImageGridWithSectionsProps {
  memos: Memo[];
  onImagePress: (imageIndex: number, allImages: GalleryImage[]) => void;
  numColumns?: number;
  isLoading?: boolean;
  onLoadMore?: () => void;
}

function ImageGridWithSectionsComponent({
  memos,
  onImagePress,
  numColumns = GALLERY_CONFIG.DEFAULT_NUM_COLUMNS,
  isLoading = false,
  onLoadMore,
}: ImageGridWithSectionsProps) {
  // Calculate grid item size
  const itemSize = useMemo(() => {
    const totalSpacing = GALLERY_CONFIG.GRID_SPACING * (numColumns + 1);
    return (screenWidth - totalSpacing) / numColumns;
  }, [numColumns]);

  // Process data into sections and flat list
  const { flatList, allImages } = useMemo(() => {
    const sections = memosToGallerySections(memos);
    const flatListData = sectionsToFlatList(sections, numColumns);

    // Create flat array of all images for viewer
    const allImagesArray: GalleryImage[] = [];
    for (const section of sections) {
      allImagesArray.push(...section.data);
    }

    return { flatList: flatListData, allImages: allImagesArray };
  }, [memos, numColumns]);

  // Get item type for FlashList optimization
  const getItemType = useCallback((item: FlatListItem) => {
    return item.type;
  }, []);

  // Handle image press with proper index calculation
  const handleImagePress = useCallback(
    (imageIndex: number) => {
      onImagePress(imageIndex, allImages);
    },
    [onImagePress, allImages],
  );

  // Render individual items
  const renderItem = useCallback(
    ({ item }: { item: FlatListItem }) => {
      if (item.type === 'header') {
        return <SectionHeader title={item.title} count={item.count} />;
      }

      // Render image row
      return (
        <XStack px={1} py={0.5} gap={1}>
          {item.images.map((image, index) => (
            <View key={image.id} style={{ width: itemSize, height: itemSize }}>
              <ImageThumbnail
                image={image}
                size={itemSize}
                index={item.startIndex + index}
                onPress={() => handleImagePress(item.startIndex + index)}
              />
            </View>
          ))}
          {/* Fill empty cells to maintain grid alignment */}
          {item.images.length < numColumns &&
            Array.from({ length: numColumns - item.images.length }).map(
              (_, i) => (
                <View
                  key={`empty-${item.startIndex}-${i}`}
                  style={{ width: itemSize, height: itemSize }}
                />
              ),
            )}
        </XStack>
      );
    },
    [itemSize, handleImagePress, numColumns],
  );

  // Extract key for each item
  const keyExtractor = useCallback((item: FlatListItem, index: number) => {
    return item.type === 'header' ? item.id : `row-${index}`;
  }, []);

  // Render footer loading indicator
  const ListFooterComponent = useMemo(
    () =>
      isLoading ? (
        <YStack p="$4" items="center">
          <Spinner size="small" />
        </YStack>
      ) : null,
    [isLoading],
  );

  // Render empty state
  const ListEmptyComponent = useMemo(
    () =>
      isLoading ? null : (
        <YStack flex={1} justify="center" items="center" p="$8">
          <Text fontSize="$5" color="$color8" style={{ textAlign: 'center' }}>
            {ERROR_MESSAGES.NO_IMAGES}
          </Text>
          <Text
            fontSize="$3"
            color="$color7"
            style={{ textAlign: 'center' }}
            mt="$2"
          >
            {ERROR_MESSAGES.NO_IMAGES_DESCRIPTION}
          </Text>
        </YStack>
      ),
    [isLoading],
  );

  return (
    <YStack flex={1} bg="$background">
      <FlashList
        data={flatList}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemType={getItemType}
        estimatedItemSize={itemSize}
        onEndReached={onLoadMore}
        onEndReachedThreshold={GALLERY_CONFIG.LOADING_THRESHOLD}
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={ListEmptyComponent}
        showsVerticalScrollIndicator={Platform.OS !== 'ios'}
        contentContainerStyle={{
          paddingBottom: GALLERY_CONFIG.CONTENT_PADDING_BOTTOM,
        }}
      />
    </YStack>
  );
}

// Memoize with custom comparison
export const ImageGridWithSections = memo(
  ImageGridWithSectionsComponent,
  (prevProps, nextProps) => {
    // Only re-render if essential props change
    return (
      prevProps.memos === nextProps.memos &&
      prevProps.numColumns === nextProps.numColumns &&
      prevProps.isLoading === nextProps.isLoading &&
      prevProps.onLoadMore === nextProps.onLoadMore &&
      prevProps.onImagePress === nextProps.onImagePress
    );
  },
);
