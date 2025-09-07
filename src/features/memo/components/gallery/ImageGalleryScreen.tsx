import { useGroup } from '@/features/group/hooks/useGroup';
import { ChevronLeft } from '@tamagui/lucide-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { memo, useCallback } from 'react';
import { RefreshControl, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Button,
  ScrollView,
  Spinner,
  Text,
  Theme,
  XStack,
  YStack,
} from 'tamagui';
import { ERROR_MESSAGES } from '../../constants/gallery';
import { useImageGallery } from '../../hooks/useImageGallery';
import { useImageViewer } from '../../hooks/useImageViewer';
import { EnhancedImageViewer } from './EnhancedImageViewer';
import { ErrorState } from './ErrorState';
import { ImageGridWithSections } from './ImageGridWithSections';

export const ImageGalleryScreen = memo(function ImageGalleryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();

  // Custom hooks
  const { group } = useGroup({ groupId: id || '' });
  const {
    memos,
    isLoading,
    isRefreshing,
    hasMore,
    totalCount,
    error,
    refresh,
    loadMore,
  } = useImageGallery({ groupId: id || '' });

  const {
    isVisible: isViewerVisible,
    selectedIndex,
    viewerImages,
    openViewer,
    closeViewer,
  } = useImageViewer();

  // Event handlers
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <>
      <StatusBar 
        style={colorScheme === 'dark' ? 'light' : 'dark'} 
        translucent 
      />
      <Stack.Screen
        options={{
          headerShown: false,
          contentStyle: { backgroundColor: '#000' },
        }}
      />
      <Theme name={colorScheme === 'dark' ? 'dark' : 'light'}>
        <YStack flex={1} bg="$background">
          {/* ヘッダー */}
          <XStack
            bg="$background"
            pt={insets.top}
            pb="$3"
            px="$4"
            borderBottomWidth={1}
            borderBottomColor="$color6"
            items="center"
            gap="$3"
            animation="quick"
            enterStyle={{ opacity: 0, y: -10 }}
            opacity={1}
            y={0}
          >
            <Button
              size="$4"
              icon={ChevronLeft}
              onPress={handleBack}
              chromeless
              pressStyle={{ scale: 0.95, opacity: 0.6 }}
              animation="quick"
              color="$color11"
              circular
            />

            <YStack flex={1}>
              <Text fontSize="$5" fontWeight="700" color="$color12">
                {group?.name} の画像
              </Text>
              <Text fontSize="$2" color="$color8">
                {totalCount}枚の画像
              </Text>
            </YStack>
          </XStack>

          {/* Content */}
          {error && !isRefreshing ? (
            <ErrorState
              error={error}
              message={ERROR_MESSAGES.LOAD_FAILED}
              onRetry={refresh}
            />
          ) : isLoading && memos.length === 0 ? (
            <YStack flex={1} justify="center" items="center">
              <Spinner size="large" />
            </YStack>
          ) : isRefreshing ? (
            <ScrollView
              flex={1}
              refreshControl={
                <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
              }
            />
          ) : (
            <ImageGridWithSections
              memos={memos}
              onImagePress={openViewer}
              isLoading={isLoading && memos.length > 0}
              onLoadMore={hasMore ? loadMore : undefined}
            />
          )}

          {/* 画像ビューアー */}
          {selectedIndex !== null && (
            <EnhancedImageViewer
              images={viewerImages}
              initialIndex={selectedIndex}
              isVisible={isViewerVisible}
              onClose={closeViewer}
            />
          )}
        </YStack>
      </Theme>
    </>
  );
});
