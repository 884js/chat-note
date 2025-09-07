import { EmptyState } from '@/components/ui/EmptyState';
import { FlashList } from '@shopify/flash-list';
import { FileText } from '@tamagui/lucide-icons';
import { memo, useCallback } from 'react';
import { RefreshControl, useWindowDimensions } from 'react-native';
import { Spinner, YStack } from 'tamagui';
import type { GroupWithLastMemo } from '../types';
import { GroupGridCard } from './GroupGridCard';

interface GroupGridProps {
  groups: GroupWithLastMemo[];
  onGroupPress: (groupId: string) => void;
  onGroupLongPress?: (group: GroupWithLastMemo) => void;
  onCreateGroup?: () => void;
  isLoading?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
}

export const GroupGrid = memo(function GroupGrid({
  groups,
  onGroupPress,
  onGroupLongPress,
  onCreateGroup,
  isLoading = false,
  isRefreshing = false,
  onRefresh,
}: GroupGridProps) {
  const { width } = useWindowDimensions();
  const numColumns = 2; // 2列固定
  const horizontalPadding = 16;
  const gap = 12;
  const cardWidth =
    (width - horizontalPadding * 2 - gap * (numColumns - 1)) / numColumns;

  const renderItem = useCallback(
    ({ item, index }: { item: GroupWithLastMemo; index: number }) => {
      const isLeftColumn = index % numColumns === 0;

      return (
        <YStack flex={1} mr={isLeftColumn ? gap : 0} mb={gap}>
          <GroupGridCard
            group={item}
            onPress={() => onGroupPress(item.id)}
            onLongPress={
              onGroupLongPress ? () => onGroupLongPress(item) : undefined
            }
          />
        </YStack>
      );
    },
    [onGroupPress, onGroupLongPress],
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
        estimatedItemSize={140}
        numColumns={numColumns}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding,
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
