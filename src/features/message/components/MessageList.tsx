import { memo, useCallback, useRef, useEffect } from 'react';
import { FlashList } from '@shopify/flash-list';
import { YStack, Spinner, Text } from 'tamagui';
import { RefreshControl } from 'react-native';
import { MessageBubble } from './MessageBubble';
import { DateDivider } from './DateDivider';
import type { Message, MessageGroup } from '../types';

interface MessageListProps {
  messageGroups: MessageGroup[];
  onMessageLongPress?: (message: Message) => void;
  onImagePress?: (imageUri: string) => void;
  onLoadMore?: () => void;
  isLoading?: boolean;
  hasMore?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

type ListItem = 
  | { type: 'date'; date: string }
  | { type: 'message'; message: Message };

export const MessageList = memo(function MessageList({
  messageGroups,
  onMessageLongPress,
  onImagePress,
  onLoadMore,
  isLoading = false,
  hasMore = false,
  onRefresh,
  isRefreshing = false,
}: MessageListProps) {
  const listRef = useRef<any>(null);

  // フラットなリストアイテムに変換
  const listItems: ListItem[] = messageGroups.flatMap(group => [
    { type: 'date' as const, date: group.date },
    ...group.messages.map(msg => ({ type: 'message' as const, message: msg })),
  ]);

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => {
      if (item.type === 'date') {
        return <DateDivider date={item.date} />;
      }
      return (
        <MessageBubble
          message={item.message}
          onLongPress={onMessageLongPress}
          onImagePress={onImagePress}
        />
      );
    },
    [onMessageLongPress, onImagePress]
  );

  const keyExtractor = useCallback((item: ListItem, index: number) => {
    if (item.type === 'date') {
      return `date-${item.date}-${index}`;
    }
    return `msg-${item.message.id}`;
  }, []);

  const getItemType = useCallback((item: ListItem) => {
    return item.type;
  }, []);

  const handleEndReached = useCallback(() => {
    if (hasMore && !isLoading && onLoadMore) {
      onLoadMore();
    }
  }, [hasMore, isLoading, onLoadMore]);

  const ListFooterComponent = useCallback(() => {
    if (isLoading && listItems.length > 0) {
      return (
        <YStack py="$3" items="center">
          <Spinner size="small" />
        </YStack>
      );
    }
    return null;
  }, [isLoading, listItems.length]);

  const ListEmptyComponent = useCallback(() => {
    if (isLoading) {
      return (
        <YStack flex={1} justify="center" items="center" py="$10">
          <Spinner size="large" />
        </YStack>
      );
    }
    return (
      <YStack flex={1} justify="center" items="center" py="$10">
        <Text fontSize="$4" color="$color10">
          メッセージがありません
        </Text>
        <Text fontSize="$3" color="$color9" mt="$2">
          最初のメッセージを送信してください
        </Text>
      </YStack>
    );
  }, [isLoading]);

  // 新しいメッセージが追加されたら最下部へスクロール
  useEffect(() => {
    if (listItems.length > 0) {
      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [listItems.length]);

  return (
    <YStack flex={1}>
      <FlashList
        ref={listRef}
        data={listItems}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemType={getItemType}
        // @ts-ignore - estimatedItemSize is a valid prop for performance optimization
        estimatedItemSize={80}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={ListEmptyComponent}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor="#999"
            />
          ) : undefined
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 16,
        }}
      />
    </YStack>
  );
});