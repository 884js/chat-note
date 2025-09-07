import { DrawerMenu } from '@/components/navigation/DrawerMenu';
import { FAB } from '@/components/ui/FAB';
import { SearchBox } from '@/components/ui/SearchBox';
import { GroupGrid } from '@/features/group/components/GroupGrid';
import { GroupList } from '@/features/group/components/GroupList';
import { useGroups } from '@/features/group/hooks/useGroups';
import { useViewMode } from '@/features/group/hooks/useViewMode';
import {
  ChevronDown,
  LayoutGrid,
  List,
  Menu,
  Plus,
} from '@tamagui/lucide-icons';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Sheet, Text, Theme, XStack, YStack } from 'tamagui';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { groups, isLoading, refetch, archiveGroup } = useGroups('lastUpdated');
  const { viewMode, setViewMode } = useViewMode();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showViewOptions, setShowViewOptions] = useState(false);

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
      // メモ画面へ遷移
      try {
        router.push(`/group/${groupId}`);
      } catch (error) {
        console.error('Navigation error:', error);
      }
    },
    [router],
  );

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
  const handleGroupEdit = useCallback(
    (group: (typeof groups)[0]) => {
      // 編集画面へ遷移
      console.log(`Edit group ${group.id}`);
      router.push(`/group/${group.id}/edit`);
    },
    [router],
  );

  // 新規グループ作成
  const handleCreateGroup = useCallback(() => {
    router.push('/group/create');
  }, [router]);

  // グループ長押し時の処理（グリッド用）
  const handleGroupLongPress = useCallback(
    (group: (typeof groups)[0]) => {
      Alert.alert(
        group.name,
        '操作を選択してください',
        [
          {
            text: '編集',
            onPress: () => router.push(`/group/${group.id}/edit`),
          },
          {
            text: 'アーカイブ',
            onPress: () => handleGroupArchive(group.id),
            style: 'destructive',
          },
          {
            text: 'キャンセル',
            style: 'cancel',
          },
        ],
        { cancelable: true },
      );
    },
    [router, handleGroupArchive],
  );

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
    }, [refetch]),
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Theme name="light">
        <YStack flex={1} bg="$backgroundHover">
          {/* ヘッダー */}
          <YStack
            bg="$background"
            pt={insets.top + 16}
            pb="$3"
            px="$4"
            shadowColor="$shadowColor"
            shadowRadius={4}
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.03}
            borderBottomWidth={1}
            borderBottomColor="$borderColor"
            gap="$2"
          >
            {/* メニューと検索ボックス */}
            <XStack gap="$2" items="center">
              {/* ハンバーガーメニューボタン */}
              <Button
                size="$4"
                circular
                chromeless
                icon={<Menu size={24} color="$color11" />}
                onPress={() => setShowMenu(true)}
                pressStyle={{ scale: 0.95 }}
                animation="bouncy"
                animateOnly={['transform']}
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

            {/* ビューモード切り替えとグループ数表示 */}
            {(groups.length > 0 || searchQuery) && (
              <XStack justify="space-between" items="center" px="$2">
                {/* グループ数表示 */}
                <Text fontSize="$2" color="$color11" fontWeight="500">
                  {searchQuery
                    ? `${filteredGroups.length}件の検索結果`
                    : `${groups.length}件のグループ`}
                </Text>

                {/* 表示オプションボタン */}
                <Button
                  size="$2"
                  variant="outlined"
                  icon={
                    viewMode === 'list' ? (
                      <List size={16} />
                    ) : (
                      <LayoutGrid size={16} />
                    )
                  }
                  iconAfter={<ChevronDown size={14} />}
                  onPress={() => setShowViewOptions(true)}
                  rounded="$3"
                  fontSize="$2"
                  px="$2.5"
                  py="$1"
                  animation="quick"
                  pressStyle={{ scale: 0.98 }}
                >
                  表示
                </Button>
              </XStack>
            )}
          </YStack>

          {/* グループリスト/グリッド */}
          {viewMode === 'list' ? (
            <GroupList
              groups={filteredGroups}
              onGroupPress={handleGroupPress}
              onGroupArchive={handleGroupArchive}
              onGroupEdit={handleGroupEdit}
              onCreateGroup={handleCreateGroup}
              isLoading={isLoading}
              isRefreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          ) : (
            <GroupGrid
              groups={filteredGroups}
              onGroupPress={handleGroupPress}
              onGroupLongPress={handleGroupLongPress}
              onCreateGroup={handleCreateGroup}
              isLoading={isLoading}
              isRefreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          )}

          {/* FABボタン */}
          <FAB
            icon={<Plus size={24} color="white" />}
            onPress={handleCreateGroup}
          />

          {/* ドロワーメニュー */}
          <DrawerMenu isOpen={showMenu} onClose={() => setShowMenu(false)} />

          {/* 表示オプションシート */}
          <Sheet
            modal
            open={showViewOptions}
            onOpenChange={setShowViewOptions}
            snapPoints={[25]}
            dismissOnSnapToBottom
            zIndex={100000}
          >
            <Sheet.Overlay
              animation="lazy"
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
              bg="rgba(0, 0, 0, 0.3)"
            />
            <Sheet.Frame
              bg="$background"
              borderTopLeftRadius="$4"
              borderTopRightRadius="$4"
              shadowColor="$shadowColor"
              shadowRadius={12}
              shadowOffset={{ width: 0, height: -4 }}
              shadowOpacity={0.15}
            >
              <Sheet.Handle />
              <YStack p="$4" gap="$3">
                <Text fontSize="$5" fontWeight="600" mb="$2">
                  表示形式
                </Text>

                {/* リスト表示オプション */}
                <Button
                  size="$4"
                  bg={viewMode === 'list' ? '$color5' : '$background'}
                  borderWidth={1}
                  borderColor={viewMode === 'list' ? '$color7' : '$borderColor'}
                  icon={<List size={20} />}
                  justify="flex-start"
                  onPress={() => {
                    setViewMode('list');
                    setShowViewOptions(false);
                  }}
                  rounded="$3"
                  animation="quick"
                >
                  <YStack flex={1} items="flex-start">
                    <Text fontSize="$4" fontWeight="500">
                      リスト表示
                    </Text>
                    <Text fontSize="$2" opacity={0.7}>
                      詳細情報を含む縦並びレイアウト
                    </Text>
                  </YStack>
                </Button>

                {/* グリッド表示オプション */}
                <Button
                  size="$4"
                  bg={viewMode === 'grid' ? '$color5' : '$background'}
                  borderWidth={1}
                  borderColor={viewMode === 'grid' ? '$color7' : '$borderColor'}
                  icon={<LayoutGrid size={20} />}
                  justify="flex-start"
                  onPress={() => {
                    setViewMode('grid');
                    setShowViewOptions(false);
                  }}
                  rounded="$3"
                  animation="quick"
                >
                  <YStack flex={1} items="flex-start">
                    <Text fontSize="$4" fontWeight="500">
                      グリッド表示
                    </Text>
                    <Text fontSize="$2" opacity={0.7}>
                      コンパクトな2列カードレイアウト
                    </Text>
                  </YStack>
                </Button>
              </YStack>
            </Sheet.Frame>
          </Sheet>
        </YStack>
      </Theme>
    </>
  );
}
