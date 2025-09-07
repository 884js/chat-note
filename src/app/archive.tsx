import { EmptyState } from '@/components/ui/EmptyState';
import { SwipeableArchivedCard } from '@/features/group/components/SwipeableArchivedCard';
import type { GroupWithLastMemo } from '@/features/group/types';
import { groupRepository } from '@/lib/database';
import { Archive, ArrowLeft } from '@tamagui/lucide-icons';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, RefreshControl, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Text, Theme, XStack, YStack } from 'tamagui';

export default function ArchiveScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const [archivedGroups, setArchivedGroups] = useState<GroupWithLastMemo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // アーカイブされたグループを取得
  const fetchArchivedGroups = useCallback(async () => {
    setIsLoading(true);
    try {
      const groups = await groupRepository.getArchivedGroups();
      setArchivedGroups(groups);
    } catch (error) {
      console.error('Failed to fetch archived groups:', error);
      Alert.alert('エラー', 'アーカイブの読み込みに失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArchivedGroups();
  }, [fetchArchivedGroups]);

  // リフレッシュ処理
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchArchivedGroups();
    setIsRefreshing(false);
  }, [fetchArchivedGroups]);

  // グループタップ時の処理（チャット画面へ）
  const handleGroupPress = useCallback(
    (groupId: string) => {
      router.push(`/group/${groupId}`);
    },
    [router],
  );

  // グループの復元
  const handleUnarchive = useCallback(
    async (group: GroupWithLastMemo) => {
      console.log('Unarchiving group:', group.id);
      try {
        await groupRepository.unarchiveGroup(group.id);
        await fetchArchivedGroups();
        // Alert.alertを削除（SwipeableArchivedGroupCard内で既に確認済み）
      } catch (error) {
        console.error('Failed to unarchive group:', error);
        Alert.alert('エラー', '復元に失敗しました');
      }
    },
    [fetchArchivedGroups],
  );

  // グループの完全削除
  const handleDelete = useCallback(
    async (group: GroupWithLastMemo) => {
      console.log('Deleting group:', group.id);
      try {
        await groupRepository.deleteGroup(group.id);
        await fetchArchivedGroups();
        // Alert.alertを削除（SwipeableArchivedGroupCard内で既に確認済み）
      } catch (error) {
        console.error('Failed to delete group:', error);
        Alert.alert('エラー', '削除に失敗しました');
      }
    },
    [fetchArchivedGroups],
  );

  // グループカードのレンダリング
  const renderGroup = ({ item }: { item: GroupWithLastMemo }) => (
    <SwipeableArchivedCard
      group={item}
      onPress={() => handleGroupPress(item.id)}
      onUnarchive={handleUnarchive}
      onDelete={handleDelete}
    />
  );

  return (
    <>
      <StatusBar 
        style={colorScheme === 'dark' ? 'light' : 'dark'} 
        translucent 
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Theme name={colorScheme === 'dark' ? 'dark' : 'light'}>
        <YStack flex={1} bg="$background">
          {/* ヘッダー */}
          <YStack
            bg="$background"
            pt={insets.top}
            pb="$3"
            px="$4"
            borderBottomWidth={1}
            borderBottomColor="$color6"
          >
            <XStack items="center" gap="$2">
              {/* 戻るボタン */}
              <Button
                size="$4"
                circular
                chromeless
                icon={<ArrowLeft size={24} />}
                onPress={() => router.back()}
                pressStyle={{ opacity: 0.5 }}
                animation="quick"
              />
              <Text fontSize="$6" fontWeight="bold">
                アーカイブ
              </Text>
            </XStack>

            {/* グループ数表示 */}
            {archivedGroups.length > 0 && (
              <Text fontSize="$2" color="$color10" px="$2" mt="$2">
                {archivedGroups.length}件のアーカイブ
              </Text>
            )}
          </YStack>

          {/* グループリスト */}
          {archivedGroups.length === 0 && !isLoading ? (
            <EmptyState
              icon={<Archive size={64} color="$color8" />}
              title="アーカイブはありません"
              description="スワイプでグループをアーカイブできます"
            />
          ) : (
            <FlatList
              data={archivedGroups}
              renderItem={renderGroup}
              keyExtractor={(item) => item.id}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                />
              }
              contentContainerStyle={{
                paddingTop: 16,
                paddingBottom: insets.bottom + 16,
              }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </YStack>
      </Theme>
    </>
  );
}
