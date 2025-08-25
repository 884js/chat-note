import { FAB } from '@/components/ui/FAB';
import { SearchBox } from '@/components/ui/SearchBox';
import { GroupActionSheet } from '@/features/group/components/GroupActionSheet';
import { GroupList } from '@/features/group/components/GroupList';
import { useGroups } from '@/features/group/hooks/useGroups';
import { Plus } from '@tamagui/lucide-icons';
import { Stack, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Theme, YStack } from 'tamagui';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { groups, isLoading, refetch, deleteGroup } = useGroups('lastUpdated');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<(typeof groups)[0] | null>(
    null,
  );
  const [showActionSheet, setShowActionSheet] = useState(false);

  // 検索フィルタリング
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) {
      return groups;
    }

    const query = searchQuery.toLowerCase();
    return groups.filter(
      (group) =>
        group.name.toLowerCase().includes(query) ||
        group.description?.toLowerCase().includes(query) ||
        group.lastMemo?.toLowerCase().includes(query),
    );
  }, [groups, searchQuery]);

  // グループタップ時の処理
  const handleGroupPress = useCallback(
    (groupId: string) => {
      console.log('Group pressed:', groupId);
      // メモ画面へ遷移
      try {
        router.push(`/group/${groupId}`);
        console.log('Navigation triggered to:', `/group/${groupId}`);
      } catch (error) {
        console.error('Navigation error:', error);
      }
    },
    [router],
  );

  // グループ長押し時の処理
  const handleGroupLongPress = useCallback(
    (groupId: string) => {
      const group = groups.find((g) => g.id === groupId);
      if (!group) return;

      setSelectedGroup(group);
      setShowActionSheet(true);
    },
    [groups],
  );

  // グループ編集処理
  const handleEditGroup = useCallback(() => {
    if (!selectedGroup) return;
    console.log(`Edit group ${selectedGroup.id}`);
    // TODO: 編集画面のルートを作成後、パスを修正
    // router.push(`/room/${selectedGroup.id}/edit`);
  }, [selectedGroup]);

  // グループ削除処理
  const handleDeleteGroup = useCallback(async () => {
    if (!selectedGroup) return;
    try {
      await deleteGroup(selectedGroup.id);
    } catch (error) {
      Alert.alert('エラー', 'グループの削除に失敗しました');
    }
  }, [selectedGroup, deleteGroup]);

  // 新規グループ作成
  const handleCreateGroup = useCallback(() => {
    router.push('/group/create');
  }, [router]);

  // リフレッシュ処理
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    refetch();
    setTimeout(() => setIsRefreshing(false), 1000);
  }, [refetch]);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Theme name="light">
        <YStack flex={1} bg="$background">
          {/* ヘッダー */}
          <YStack
            bg="$background"
            pt={insets.top}
            pb="$3"
            px="$4"
            borderBottomWidth={1}
            borderBottomColor="$color6"
            gap="$2"
          >
            {/* 検索ボックス */}
            <SearchBox
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="グループを検索..."
            />

            {/* 検索結果数 */}
            {searchQuery && (
              <Text fontSize="$2" color="$color10" px="$2">
                {filteredGroups.length}件の検索結果
              </Text>
            )}
          </YStack>

          {/* グループリスト */}
          <GroupList
            groups={filteredGroups}
            onGroupPress={handleGroupPress}
            onGroupLongPress={handleGroupLongPress}
            onCreateGroup={handleCreateGroup}
            isLoading={isLoading}
            isRefreshing={isRefreshing}
            onRefresh={handleRefresh}
          />

          {/* FABボタン */}
          <FAB
            icon={<Plus size={24} color="white" />}
            onPress={handleCreateGroup}
          />

          {/* アクションシート */}
          <GroupActionSheet
            isOpen={showActionSheet}
            onOpenChange={setShowActionSheet}
            group={selectedGroup}
            onEdit={handleEditGroup}
            onDelete={handleDeleteGroup}
          />
        </YStack>
      </Theme>
    </>
  );
}
