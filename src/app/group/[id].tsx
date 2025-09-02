import { useGroup } from '@/features/group/hooks/useGroup';
import { ImageViewer } from '@/features/memo/components/ImageViewer';
import { MemoInput } from '@/features/memo/components/MemoInput';
import { MemoList } from '@/features/memo/components/MemoList';
import { useMemos } from '@/features/memo/hooks/useMemos';
import type { Memo } from '@/features/memo/types';
import { Image as ImageIcon, MoreVertical, X } from '@tamagui/lucide-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Text, Theme, XStack, YStack } from 'tamagui';

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

  const { group } = useGroup({ groupId: id || '' });

  const { memoGroups, isLoading, hasMore, sendMemo, deleteMemo, loadMore } =
    useMemos({ groupId: id || '' });

  // メモ送信
  const handleSend = useCallback(
    async (content?: string, imageUri?: string) => {
      try {
        await sendMemo({
          groupId: id || '1',
          content,
          imageUri,
        });
      } catch (error) {
        Alert.alert('エラー', 'メモの送信に失敗しました');
      }
    },
    [id, sendMemo],
  );

  // メモ長押し
  const handleMemoLongPress = useCallback(
    (memo: Memo) => {
      Alert.alert('メモ操作', memo.content?.substring(0, 50) || '画像', [
        {
          text: 'コピー',
          onPress: () => {
            // TODO: クリップボードにコピー
            console.log('Copy memo:', memo.id);
          },
        },
        {
          text: '編集',
          onPress: () => {
            // TODO: 編集モーダルを表示
            console.log('Edit memo:', memo.id);
          },
        },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => {
            Alert.alert('削除の確認', 'このメモを削除しますか？', [
              { text: 'キャンセル', style: 'cancel' },
              {
                text: '削除',
                style: 'destructive',
                onPress: () => deleteMemo(memo.id),
              },
            ]);
          },
        },
        { text: 'キャンセル', style: 'cancel' },
      ]);
    },
    [deleteMemo],
  );

  // 画像タップ
  const handleImagePress = useCallback((imageUri: string) => {
    setSelectedImageUri(imageUri);
  }, []);

  // 画像ビューアーを閉じる
  const handleCloseImageViewer = useCallback(() => {
    setSelectedImageUri(null);
  }, []);

  // リフレッシュ
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    // TODO: メモを再取得
    setTimeout(() => setIsRefreshing(false), 1000);
  }, []);

  // その他メニュー
  const handleMorePress = useCallback(() => {
    Alert.alert('グループ設定', undefined, [
      {
        text: '画像一覧',
        onPress: () => {
          router.push(`/group/${id}/gallery`);
        },
      },
      {
        text: 'グループ情報を編集',
        onPress: () => {
          router.push(`/group/${id}/edit`);
        },
      },
      { text: 'キャンセル', style: 'cancel' },
    ]);
  }, [id, router]);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          contentStyle: { backgroundColor: '#f5f5f5' },
        }}
      />
      <Theme name="light">
        <YStack flex={1} bg="$background">
          {/* カスタムヘッダー */}
          <XStack
            bg="$background"
            pt={insets.top}
            pb="$3"
            px="$4"
            borderBottomWidth={1}
            borderBottomColor="$color6"
            items="center"
            gap="$3"
            animation="quick"
            enterStyle={{ opacity: 0, y: -10 }}
            opacity={1}
            y={0}
          >
            <Button
              size="$4"
              icon={X}
              onPress={() => router.push('/')}
              chromeless
              pressStyle={{ scale: 0.95, opacity: 0.6 }}
              animation="quick"
              color="$color11"
              circular
            />

            <YStack flex={1}>
              <Text fontSize="$5" fontWeight="700" color="$color12">
                {group?.name}
              </Text>
            </YStack>

            <TouchableOpacity
              onPress={() => router.push(`/group/${id}/gallery`)}
              activeOpacity={0.7}
              style={{ padding: 8 }}
            >
              <ImageIcon size="$1.5" color="$color11" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleMorePress}
              activeOpacity={0.7}
              style={{ padding: 8 }}
            >
              <MoreVertical size="$1.5" color="$color11" />
            </TouchableOpacity>
          </XStack>

          {/* メモリスト */}
          <MemoList
            memoGroups={memoGroups}
            onMemoLongPress={handleMemoLongPress}
            onImagePress={handleImagePress}
            onLoadMore={loadMore}
            isLoading={isLoading}
            hasMore={hasMore}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />

          {/* メモ入力 */}
          <KeyboardAvoidingView behavior={'padding'}>
            <MemoInput onSend={handleSend} placeholder="メモを入力..." />
          </KeyboardAvoidingView>
        </YStack>
      </Theme>

      {/* 画像ビューアー */}
      <ImageViewer
        imageUri={selectedImageUri}
        isVisible={selectedImageUri !== null}
        onClose={handleCloseImageViewer}
      />
    </>
  );
}
