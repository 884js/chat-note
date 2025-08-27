import { EmptyState } from '@/components/ui/EmptyState';
import { FlashList } from '@shopify/flash-list';
import { FileText } from '@tamagui/lucide-icons';
import { memo, useCallback } from 'react';
import { RefreshControl } from 'react-native';
import { Spinner, YStack } from 'tamagui';
import type { GroupWithLastMemo } from '../types';
import { SwipeableGroupCard } from './SwipeableGroupCard';

interface GroupListProps {
  groups: GroupWithLastMemo[];
  onGroupPress: (groupId: string) => void;
  onGroupLongPress?: (groupId: string) => void;
  onGroupArchive?: (groupId: string) => void;
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
        onEdit={onGroupEdit}
      />
    ),
    [onGroupPress, onGroupLongPress, onGroupArchive, onGroupEdit],
  );

  const keyExtractor = useCallback((item: GroupWithLastMemo) => item.id, []);

  const ListEmptyComponent = useCallback(
    () => (
      <EmptyState
        title="グループを作って始めよう"
        description="買い物リスト、アイデアメモ、日記など
用途別にグループを作って整理できます"
        icon={<FileText size={48} opacity={0.5} />}
        action={
          onCreateGroup
            ? {
                label: '最初のグループを作る',
                onPress: onCreateGroup,
              }
            : undefined
        }
      />
    ),
    [onCreateGroup],
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
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 100, // FABのスペース
          paddingTop: 16,
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
