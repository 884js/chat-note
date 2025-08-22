import { useCallback, useState } from 'react';
import { YStack, XStack, Text, Theme, Button } from 'tamagui';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ArrowLeft, MoreVertical } from '@tamagui/lucide-icons';
import { Alert, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MessageList } from '@/features/message/components/MessageList';
import { MessageInput } from '@/features/message/components/MessageInput';
import { useMessages } from '@/features/message/hooks/useMessages';
import type { Message } from '@/features/message/types';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const roomName = 'アイデアメモ'; // 仮のルーム名

  const {
    messageGroups,
    isLoading,
    hasMore,
    sendMessage,
    deleteMessage,
    loadMore,
  } = useMessages(id || '1');
  // メッセージ送信
  const handleSend = useCallback(
    async (content: string) => {
      try {
        await sendMessage({
          roomId: id || '1',
          content,
        });
      } catch (error) {
        Alert.alert('エラー', 'メッセージの送信に失敗しました');
      }
    },
    [id, sendMessage],
  );

  // メッセージ長押し
  const handleMessageLongPress = useCallback(
    (message: Message) => {
      Alert.alert(
        'メッセージ操作',
        message.content?.substring(0, 50) || '画像',
        [
          {
            text: 'コピー',
            onPress: () => {
              // TODO: クリップボードにコピー
              console.log('Copy message:', message.id);
            },
          },
          {
            text: '編集',
            onPress: () => {
              // TODO: 編集モーダルを表示
              console.log('Edit message:', message.id);
            },
          },
          {
            text: '削除',
            style: 'destructive',
            onPress: () => {
              Alert.alert('削除の確認', 'このメッセージを削除しますか？', [
                { text: 'キャンセル', style: 'cancel' },
                {
                  text: '削除',
                  style: 'destructive',
                  onPress: () => deleteMessage(message.id),
                },
              ]);
            },
          },
          { text: 'キャンセル', style: 'cancel' },
        ],
      );
    },
    [deleteMessage],
  );

  // 画像タップ
  const handleImagePress = useCallback((imageUri: string) => {
    // TODO: 画像プレビュー画面を表示
    console.log('Preview image:', imageUri);
  }, []);

  // リフレッシュ
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    // TODO: メッセージを再取得
    setTimeout(() => setIsRefreshing(false), 1000);
  }, []);

  // その他メニュー
  const handleMorePress = useCallback(() => {
    Alert.alert('ルーム設定', undefined, [
      {
        text: 'ルーム情報を編集',
        onPress: () => {
          // TODO: 編集画面へ遷移
          console.log('Edit room');
        },
      },
      {
        text: 'メッセージを検索',
        onPress: () => {
          // TODO: 検索画面へ遷移
          console.log('Search messages');
        },
      },
      {
        text: 'エクスポート',
        onPress: () => {
          // TODO: エクスポート機能
          console.log('Export messages');
        },
      },
      { text: 'キャンセル', style: 'cancel' },
    ]);
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
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
            borderBottomColor="$color4"
            items="center"
            gap="$3"
            animation="quick"
            enterStyle={{ opacity: 0, y: -10 }}
            opacity={1}
            y={0}
          >
            <Button
              size="$4"
              icon={ArrowLeft}
              onPress={() => router.push('/')}
              chromeless
              pressStyle={{ scale: 0.95, opacity: 0.6 }}
              animation="quick"
              color="$primary"
            >
              戻る
            </Button>

            <YStack flex={1}>
              <Text fontSize="$5" fontWeight="700" color="$color12">
                {roomName}
              </Text>
              <Text fontSize="$2" color="$color10">
                Room ID: {id}
              </Text>
            </YStack>

            <TouchableOpacity
              onPress={handleMorePress}
              activeOpacity={0.7}
              style={{ padding: 8 }}
            >
              <MoreVertical size="$1.5" color="$color11" />
            </TouchableOpacity>
          </XStack>

          {/* メッセージリスト */}
          <MessageList
            messageGroups={messageGroups}
            onMessageLongPress={handleMessageLongPress}
            onImagePress={handleImagePress}
            onLoadMore={loadMore}
            isLoading={isLoading}
            hasMore={hasMore}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />

          {/* メッセージ入力 */}
          <KeyboardAvoidingView behavior={'padding'}>
            <MessageInput
              onSend={handleSend}
              placeholder="メッセージを入力..."
            />
          </KeyboardAvoidingView>
        </YStack>
      </Theme>
    </>
  );
}
