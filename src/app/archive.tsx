import { EmptyState } from '@/components/ui/EmptyState';
import { GroupCard } from '@/features/group/components/GroupCard';
import { groupRepository } from '@/lib/database';
import type { GroupWithLastMemo } from '@/features/group/types';
import { Archive, ArrowLeft, RotateCcw, Trash2 } from '@tamagui/lucide-icons';
import { Stack, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Text, Theme, XStack, YStack } from 'tamagui';

export default function ArchiveScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
      Alert.alert(
        'グループを復元',
        `「${group.name}」を復元しますか？`,
        [
          { text: 'キャンセル', style: 'cancel' },
          {
            text: '復元',
            onPress: async () => {
              try {
                await groupRepository.unarchiveGroup(group.id);
                await fetchArchivedGroups();
                Alert.alert('完了', 'グループを復元しました');
              } catch (error) {
                console.error('Failed to unarchive group:', error);
                Alert.alert('エラー', '復元に失敗しました');
              }
            },
          },
        ],
      );
    },
    [fetchArchivedGroups],
  );

  // グループの完全削除
  const handleDelete = useCallback(
    async (group: GroupWithLastMemo) => {
      Alert.alert(
        '警告',
        `「${group.name}」を完全に削除しますか？\n\nこの操作は取り消せません。グループ内のすべてのメモも削除されます。`,
        [
          { text: 'キャンセル', style: 'cancel' },
          {
            text: '削除',
            style: 'destructive',
            onPress: async () => {
              try {
                await groupRepository.deleteGroup(group.id);
                await fetchArchivedGroups();
                Alert.alert('完了', 'グループを削除しました');
              } catch (error) {
                console.error('Failed to delete group:', error);
                Alert.alert('エラー', '削除に失敗しました');
              }
            },
          },
        ],
      );
    },
    [fetchArchivedGroups],
  );

  // グループカードのレンダリング
  const renderGroup = ({ item }: { item: GroupWithLastMemo }) => (
    <YStack px="$4" mb="$3">
      <GroupCard group={item} onPress={() => handleGroupPress(item.id)} />
      <XStack gap="$2" mt="$2">
        <Button
          flex={1}
          size="$3"
          icon={<RotateCcw size={18} />}
          onPress={() => handleUnarchive(item)}
          theme="blue"
        >
          復元
        </Button>
        <Button
          flex={1}
          size="$3"
          icon={<Trash2 size={18} />}
          onPress={() => handleDelete(item)}
          theme="red"
        >
          削除
        </Button>
      </XStack>
    </YStack>
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
            />
          )}
        </YStack>
      </Theme>
    </>
  );
}