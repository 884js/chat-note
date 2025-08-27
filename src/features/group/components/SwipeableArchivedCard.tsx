import { RotateCcw, Trash2 } from '@tamagui/lucide-icons';
import { memo, useCallback } from 'react';
import { Alert } from 'react-native';
import { SwipeableCard } from '@/components/ui/SwipeableCard';
import type { GroupWithLastMemo } from '../types';
import { GroupCard } from './GroupCard';

interface SwipeableArchivedCardProps {
  group: GroupWithLastMemo;
  onPress: () => void;
  onUnarchive: (group: GroupWithLastMemo) => void;
  onDelete: (group: GroupWithLastMemo) => void;
}

export const SwipeableArchivedCard = memo(function SwipeableArchivedCard({
  group,
  onPress,
  onUnarchive,
  onDelete,
}: SwipeableArchivedCardProps) {
  // 復元の確認と実行
  const handleUnarchive = useCallback(() => {
    Alert.alert(
      'グループを復元',
      `「${group.name}」を復元しますか？`,
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '復元',
          onPress: () => onUnarchive(group),
        },
      ],
    );
  }, [group, onUnarchive]);

  // 削除の確認と実行
  const handleDelete = useCallback(() => {
    Alert.alert(
      '警告',
      `「${group.name}」を完全に削除しますか？\n\nこの操作は取り消せません。グループ内のすべてのメモも削除されます。`,
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => onDelete(group),
        },
      ],
    );
  }, [group, onDelete]);

  return (
    <SwipeableCard
      leftSwipe={{
        icon: Trash2,
        text: '削除',
        color: 'white',
        backgroundColor: '#FF3B30',
        onAction: handleDelete,
      }}
      rightSwipe={{
        icon: RotateCcw,
        text: '復元',
        color: 'white',
        backgroundColor: '#007AFF',
        onAction: handleUnarchive,
      }}
      containerPadding={16}
      containerMarginBottom={12}
    >
      <GroupCard group={group} onPress={onPress} />
    </SwipeableCard>
  );
});