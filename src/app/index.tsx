import { useCallback, useState, useMemo } from 'react';
import { YStack, Text, Theme } from 'tamagui';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RoomList } from '@/features/room/components/RoomList';
import { FAB } from '@/components/ui/FAB';
import { SearchBox } from '@/components/ui/SearchBox';
import { useRooms } from '@/features/room/hooks/useRooms';
import { Plus } from '@tamagui/lucide-icons';
import { Alert } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { rooms, isLoading, refetch, deleteRoom } = useRooms('lastUpdated');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 検索フィルタリング
  const filteredRooms = useMemo(() => {
    if (!searchQuery.trim()) {
      return rooms;
    }
    
    const query = searchQuery.toLowerCase();
    return rooms.filter(room => 
      room.name.toLowerCase().includes(query) ||
      room.description?.toLowerCase().includes(query) ||
      room.lastMessage?.toLowerCase().includes(query)
    );
  }, [rooms, searchQuery]);

  // ルームタップ時の処理
  const handleRoomPress = useCallback(
    (roomId: string) => {
      console.log('Room pressed:', roomId);
      // チャット画面へ遷移
      try {
        router.push(`/room/${roomId}`);
        console.log('Navigation triggered to:', `/room/${roomId}`);
      } catch (error) {
        console.error('Navigation error:', error);
      }
    },
    [router],
  );

  // ルーム長押し時の処理
  const handleRoomLongPress = useCallback(
    (roomId: string) => {
      const room = rooms.find((r) => r.id === roomId);
      if (!room) return;

      Alert.alert(room.name, '選択してください', [
        {
          text: '編集',
          onPress: () => {
            console.log(`Edit room ${roomId}`);
            // TODO: 編集画面のルートを作成後、パスを修正
            // router.push(`/room/${roomId}/edit`);
          },
        },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              '削除の確認',
              `「${room.name}」を削除しますか？\nこの操作は取り消せません。`,
              [
                { text: 'キャンセル', style: 'cancel' },
                {
                  text: '削除',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await deleteRoom(roomId);
                    } catch (error) {
                      Alert.alert('エラー', '削除に失敗しました');
                    }
                  },
                },
              ],
            );
          },
        },
        { text: 'キャンセル', style: 'cancel' },
      ]);
    },
    [rooms, deleteRoom],
  );

  // 新規ルーム作成
  const handleCreateRoom = useCallback(() => {
    console.log('Create new room');
    // TODO: 作成画面のルートを作成後、パスを修正
    // router.push('/room/create');
  }, []);

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
            borderBottomColor="$color4"
            gap="$2"
          >
            {/* 検索ボックス */}
            <SearchBox
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="ルームを検索..."
            />
            
            {/* 検索結果数 */}
            {searchQuery && (
              <Text fontSize="$2" color="$color10" px="$2">
                {filteredRooms.length}件の検索結果
              </Text>
            )}
          </YStack>

          {/* ルームリスト */}
          <RoomList
            rooms={filteredRooms}
            onRoomPress={handleRoomPress}
            onRoomLongPress={handleRoomLongPress}
            onCreateRoom={handleCreateRoom}
            isLoading={isLoading}
            isRefreshing={isRefreshing}
            onRefresh={handleRefresh}
          />

          {/* FABボタン */}
          <FAB
            icon={<Plus size={24} color="white" />}
            onPress={handleCreateRoom}
          />
        </YStack>
      </Theme>
    </>
  );
}
