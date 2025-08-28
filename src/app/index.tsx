import { DrawerMenu } from '@/components/navigation/DrawerMenu';
import { FAB } from '@/components/ui/FAB';
import { SearchBox } from '@/components/ui/SearchBox';
import { GroupActionSheet } from '@/features/group/components/GroupActionSheet';
import { GroupList } from '@/features/group/components/GroupList';
import { useGroups } from '@/features/group/hooks/useGroups';
import { Menu, Plus } from '@tamagui/lucide-icons';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Text, Theme, XStack, YStack } from 'tamagui';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { groups, isLoading, refetch, archiveGroup } = useGroups('lastUpdated');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<(typeof groups)[0] | null>(
    null,
  );
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

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

  // グループアーカイブ処理（長押しメニューから）
  const handleArchiveGroup = useCallback(async () => {
    if (!selectedGroup) return;
    try {
      await archiveGroup(selectedGroup.id);
    } catch (error) {
      Alert.alert('エラー', 'グループのアーカイブに失敗しました');
    }
  }, [selectedGroup, archiveGroup]);

  // スワイプでアーカイブ
  const handleGroupArchive = useCallback(
    async (groupId: string) => {
      try {
        await archiveGroup(groupId);
      } catch (error) {
        Alert.alert('エラー', 'アーカイブに失敗しました');
      }
    },
    [archiveGroup],
  );


  // スワイプで編集
  const handleGroupEdit = useCallback((group: (typeof groups)[0]) => {
    // 編集画面へ遷移
    console.log(`Edit group ${group.id}`);
    // TODO: 編集画面実装後に遷移
    Alert.alert('編集', `「${group.name}」を編集します`, [
      { text: 'キャンセル', style: 'cancel' },
    ]);
  }, []);

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

  // 画面フォーカス時にグループ一覧を再読み込み
  // アーカイブ画面から復元後などに自動更新される
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

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
            {/* メニューと検索ボックス */}
            <XStack gap="$2" items="center">
              {/* ハンバーガーメニューボタン */}
              <Button
                size="$4"
                circular
                chromeless
                icon={<Menu size={24} />}
                onPress={() => setShowMenu(true)}
                pressStyle={{ opacity: 0.5 }}
                animation="quick"
              />

              {/* 検索ボックス */}
              <YStack flex={1}>
                <SearchBox
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="グループを検索..."
                />
              </YStack>
            </XStack>

            {/* グループ数表示 */}
            {searchQuery ? (
              filteredGroups.length > 0 && (
                <Text fontSize="$2" color="$color10" px="$2">
                  {filteredGroups.length}件の検索結果
                </Text>
              )
            ) : (
              groups.length > 0 && (
                <Text fontSize="$2" color="$color10" px="$2">
                  {groups.length}件のグループ
                </Text>
              )
            )}
          </YStack>

          {/* グループリスト */}
          <GroupList
            groups={filteredGroups}
            onGroupPress={handleGroupPress}
            onGroupLongPress={handleGroupLongPress}
            onGroupArchive={handleGroupArchive}
            onGroupEdit={handleGroupEdit}
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
            onArchive={handleArchiveGroup}
          />

          {/* ドロワーメニュー */}
          <DrawerMenu isOpen={showMenu} onClose={() => setShowMenu(false)} />
        </YStack>
      </Theme>
    </>
  );
}
