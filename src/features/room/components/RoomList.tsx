import { memo, useCallback } from 'react';
import { FlashList } from '@shopify/flash-list';
import { YStack, Spinner, Text } from 'tamagui';
import { RefreshControl } from 'react-native';
import { RoomCard } from './RoomCard';
import { EmptyState } from '@/components/ui/EmptyState';
import type { RoomWithLastMessage } from '../types';
import { FileText } from '@tamagui/lucide-icons';

interface RoomListProps {
  rooms: RoomWithLastMessage[];
  onRoomPress: (roomId: string) => void;
  onRoomLongPress?: (roomId: string) => void;
  onCreateRoom?: () => void;
  isLoading?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
}

export const RoomList = memo(function RoomList({
  rooms,
  onRoomPress,
  onRoomLongPress,
  onCreateRoom,
  isLoading = false,
  isRefreshing = false,
  onRefresh,
}: RoomListProps) {
  const renderItem = useCallback(
    ({ item }: { item: RoomWithLastMessage }) => (
      <RoomCard
        room={item}
        onPress={() => onRoomPress(item.id)}
        onLongPress={onRoomLongPress ? () => onRoomLongPress(item.id) : undefined}
      />
    ),
    [onRoomPress, onRoomLongPress]
  );

  const keyExtractor = useCallback(
    (item: RoomWithLastMessage) => item.id,
    []
  );

  const ListEmptyComponent = useCallback(
    () => (
      <EmptyState
        title="メモがまだありません"
        description="新しいメモグループを作成して、思いついたことを記録しましょう"
        icon={<FileText size={48} opacity={0.5} />}
        action={
          onCreateRoom
            ? {
                label: '最初のメモを作成',
                onPress: onCreateRoom,
              }
            : undefined
        }
      />
    ),
    [onCreateRoom]
  );

  const ListHeaderComponent = useCallback(
    () => (
      <YStack p="$4" gap="$2">
        <Text fontSize="$2" opacity={0.6}>
          {rooms.length} 個のメモグループ
        </Text>
      </YStack>
    ),
    [rooms.length]
  );

  if (isLoading && rooms.length === 0) {
    return (
      <YStack flex={1} justify="center" items="center">
        <Spinner size="large" />
      </YStack>
    );
  }

  return (
    <YStack flex={1} bg="$background">
      <FlashList
        data={rooms}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={ListEmptyComponent}
        ListHeaderComponent={rooms.length > 0 ? ListHeaderComponent : null}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 100, // FABのスペース
        }}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor="#999"
            />
          ) : undefined
        }
        showsVerticalScrollIndicator={false}
      />
    </YStack>
  );
});