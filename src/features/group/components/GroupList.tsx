import { EmptyState } from '@/components/ui/EmptyState';
import { FlashList } from '@shopify/flash-list';
import { FileText } from '@tamagui/lucide-icons';
import { memo, useCallback } from 'react';
import { RefreshControl } from 'react-native';
import { Spinner, Text, YStack } from 'tamagui';
import type { GroupWithLastMemo } from '../types';
import { SwipeableGroupCard } from './SwipeableGroupCard';

interface GroupListProps {
  groups: GroupWithLastMemo[];
  onGroupPress: (groupId: string) => void;
  onGroupLongPress?: (groupId: string) => void;
  onGroupArchive?: (groupId: string) => void;
  onGroupDelete?: (groupId: string) => void;
  onGroupEdit?: (group: GroupWithLastMemo) => void;
  onCreateGroup?: () => void;
  isLoading?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
}

export const GroupList = memo(function GroupList({
  groups,
  onGroupPress,
  onGroupLongPress,
  onGroupArchive,
  onGroupDelete,
  onGroupEdit,
  onCreateGroup,
  isLoading = false,
  isRefreshing = false,
  onRefresh,
}: GroupListProps) {
  const renderItem = useCallback(
    ({ item }: { item: GroupWithLastMemo }) => (
      <SwipeableGroupCard
        group={item}
        onPress={() => onGroupPress(item.id)}
        onLongPress={
          onGroupLongPress ? () => onGroupLongPress(item.id) : undefined
        }
        onArchive={onGroupArchive}
        onDelete={onGroupDelete}
        onEdit={onGroupEdit}
      />
    ),
    [
      onGroupPress,
      onGroupLongPress,
      onGroupArchive,
      onGroupDelete,
      onGroupEdit,
    ],
  );

  const keyExtractor = useCallback((item: GroupWithLastMemo) => item.id, []);

  const ListEmptyComponent = useCallback(
    () => (
      <EmptyState
        title="メモがまだありません"
        description="新しいメモグループを作成して、思いついたことを記録しましょう"
        icon={<FileText size={48} opacity={0.5} />}
        action={
          onCreateGroup
            ? {
                label: '最初のグループを作成',
                onPress: onCreateGroup,
              }
            : undefined
        }
      />
    ),
    [onCreateGroup],
  );

  const ListHeaderComponent = useCallback(
    () => (
      <YStack p="$4" gap="$2">
        <Text fontSize="$2" opacity={0.6}>
          {groups.length} 個のグループ
        </Text>
      </YStack>
    ),
    [groups.length],
  );

  if (isLoading && groups.length === 0) {
    return (
      <YStack flex={1} justify="center" items="center">
        <Spinner size="large" />
      </YStack>
    );
  }

  return (
    <YStack flex={1} bg="$background">
      <FlashList
        data={groups}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        estimatedItemSize={100}
        ListEmptyComponent={ListEmptyComponent}
        ListHeaderComponent={groups.length > 0 ? ListHeaderComponent : null}
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
