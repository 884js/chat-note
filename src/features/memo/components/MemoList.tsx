import { FlashList } from '@shopify/flash-list';
import { MessageSquare } from '@tamagui/lucide-icons';
import { memo, useCallback, useRef } from 'react';
import { RefreshControl } from 'react-native';
import { Spinner, Text, YStack } from 'tamagui';
import type { Memo, MemoGroup } from '../types';
import { DateDivider } from './DateDivider';
import { MemoBubble } from './MemoBubble';

interface MemoListProps {
  memoGroups: MemoGroup[];
  onMemoLongPress?: (memo: Memo) => void;
  onImagePress?: (imageUri: string) => void;
  onLoadMore?: () => void;
  isLoading?: boolean;
  hasMore?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

type ListItem = { type: 'date'; date: string } | { type: 'memo'; memo: Memo };

export const MemoList = memo(function MemoList({
  memoGroups,
  onMemoLongPress,
  onImagePress,
  onLoadMore,
  isLoading = false,
  hasMore = false,
  onRefresh,
  isRefreshing = false,
}: MemoListProps) {
  const listRef = useRef<FlashList<ListItem>>(null);

  // フラットなリストアイテムに変換
  const listItems: ListItem[] = memoGroups.flatMap((group) => [
    ...group.memos.map((memo) => ({
      type: 'memo' as const,
      memo: memo,
    })),
    { type: 'date' as const, date: group.date },
  ]);

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => {
      if (item.type === 'date') {
        return <DateDivider date={item.date} />;
      }
      return (
        <MemoBubble
          memo={item.memo}
          onLongPress={onMemoLongPress}
          onImagePress={onImagePress}
        />
      );
    },
    [onMemoLongPress, onImagePress],
  );

  const keyExtractor = useCallback((item: ListItem, index: number) => {
    if (item.type === 'date') {
      return `date-${item.date}-${index}`;
    }
    return `memo-${item.memo.id}`;
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
        <YStack
          py="$4"
          items="center"
          animation="quick"
          enterStyle={{ opacity: 0, scale: 0.8 }}
          opacity={1}
          scale={1}
        >
          <Spinner size="small" color="$color10" />
          <Text fontSize="$2" color="$color10" mt="$2">
            読み込み中...
          </Text>
        </YStack>
      );
    }
    return null;
  }, [isLoading, listItems.length]);

  const ListEmptyComponent = useCallback(() => {
    if (isLoading) {
      return (
        <YStack
          flex={1}
          justify="center"
          items="center"
          py="$10"
          animation="bouncy"
          enterStyle={{ opacity: 0, scale: 0.9 }}
          opacity={1}
          scale={1}
        >
          <Spinner size="large" color="$color11" />
          <Text fontSize="$3" color="$color10" mt="$4">
            メモを読み込んでいます
          </Text>
        </YStack>
      );
    }
    return (
      <YStack
        flex={1}
        justify="center"
        items="center"
        py="$10"
        animation="lazy"
        enterStyle={{ opacity: 0, y: 20 }}
        opacity={1}
        y={0}
      >
        <YStack
          bg="$color3"
          p="$6"
          rounded="$6"
          items="center"
          borderWidth={1}
          borderColor="$color6"
          animation="bouncy"
          enterStyle={{ scale: 0.8 }}
          scale={1}
        >
          <MessageSquare size="$6" color="$color10" />
        </YStack>
        <Text fontSize="$5" color="$color11" fontWeight="600" mt="$6">
          最初のメモを書いてみよう
        </Text>
        <YStack items="center" px="$6" mt="$3">
          <Text fontSize="$3" color="$color10">
            思いついたこと、忘れたくないこと
          </Text>
          <Text fontSize="$3" color="$color10">
            なんでも気軽にメモしてください
          </Text>
        </YStack>
      </YStack>
    );
  }, [isLoading]);


  return (
    <YStack flex={1} bg="$background">
      <FlashList
        ref={listRef}
        data={listItems}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemType={getItemType}
        inverted={true}
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
              tintColor="#7c7c8a"
              colors={["#7c7c8a"]}
              progressBackgroundColor="transparent"
            />
          ) : undefined
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 20,
          paddingTop: 8,
        }}
        overrideProps={{
          contentContainerStyle: {
            flexGrow: 1,
            justifyContent: "flex-end",
          },
        }}
      />
    </YStack>
  );
});
