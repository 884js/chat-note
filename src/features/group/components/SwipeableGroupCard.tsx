import { Archive, Edit3 } from '@tamagui/lucide-icons';
import { memo, useCallback } from 'react';
import { SwipeableCard } from '@/components/ui/SwipeableCard';
import type { GroupWithLastMemo } from '../types';
import { GroupCard } from './GroupCard';

interface SwipeableGroupCardProps {
  group: GroupWithLastMemo;
  onPress: () => void;
  onArchive?: (groupId: string) => void;
  onEdit?: (group: GroupWithLastMemo) => void;
}

export const SwipeableGroupCard = memo(function SwipeableGroupCard({
  group,
  onPress,
  onArchive,
  onEdit,
}: SwipeableGroupCardProps) {
  // アーカイブアクション
  const handleArchive = useCallback(() => {
    onArchive?.(group.id);
  }, [group.id, onArchive]);

  // 編集アクション
  const handleEdit = useCallback(() => {
    onEdit?.(group);
  }, [group, onEdit]);

  return (
    <SwipeableCard
      leftSwipe={
        onArchive
          ? {
              icon: Archive,
              text: 'アーカイブ',
              color: 'white',
              backgroundColor: '#ff9500',
              onAction: handleArchive,
            }
          : undefined
      }
      rightSwipe={
        onEdit
          ? {
              icon: Edit3,
              text: '編集',
              color: 'white',
              backgroundColor: '#007AFF',
              onAction: handleEdit,
            }
          : undefined
      }
      hideOnLeftSwipe={true}
      containerMarginBottom={12}
    >
      <GroupCard
        group={group}
        onPress={onPress}
      />
    </SwipeableCard>
  );
});