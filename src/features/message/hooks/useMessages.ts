import { useState, useEffect, useCallback, useRef } from 'react';
import type { Message, SendMessageInput, MessageGroup } from '../types';

// モックデータ（後でSQLiteに置き換え）
const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    roomId: '1',
    content: 'プロジェクトの進捗はどうですか？',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2日前
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    isDeleted: false,
  },
  {
    id: '2',
    roomId: '1',
    content: '順調に進んでいます！明日までには完成予定です。',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1日前
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    isDeleted: false,
  },
  {
    id: '3',
    roomId: '1',
    content:
      '今日の会議のメモ:\n・デザインレビュー完了\n・実装開始\n・来週テスト予定',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3時間前
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    isDeleted: false,
  },
  {
    id: '4',
    roomId: '1',
    content: 'いいですね！頑張りましょう💪',
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30分前
    updatedAt: new Date(Date.now() - 1000 * 60 * 30),
    isDeleted: false,
  },
];

export function useMessages(roomId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);

  // メッセージ取得
  const fetchMessages = useCallback(
    async (offset = 0, limit = 20) => {
      if (loadingRef.current) return;
      loadingRef.current = true;

      try {
        // 実際の実装では SQLite からデータを取得
        await new Promise((resolve) => setTimeout(resolve, 300)); // 仮の遅延

        const roomMessages = MOCK_MESSAGES.filter((m) => m.roomId === roomId);
        const sortedMessages = roomMessages.sort(
          (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
        );

        setMessages(sortedMessages);
        setHasMore(false); // モックなので追加読み込みなし
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
        loadingRef.current = false;
      }
    },
    [roomId],
  );

  // メッセージ送信
  const sendMessage = useCallback(async (input: SendMessageInput) => {
    try {
      const newMessage: Message = {
        id: Date.now().toString(),
        roomId: input.roomId,
        content: input.content,
        imageUri: input.imageUri,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      };

      setMessages((prev) => [...prev, newMessage]);
      return newMessage;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  // メッセージ編集
  const updateMessage = useCallback(
    async (messageId: string, content: string) => {
      try {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? { ...msg, content, updatedAt: new Date() }
              : msg,
          ),
        );
      } catch (err) {
        setError(err as Error);
        throw err;
      }
    },
    [],
  );

  // メッセージ削除（論理削除）
  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, isDeleted: true, updatedAt: new Date() }
            : msg,
        ),
      );
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  // 古いメッセージを読み込む
  const loadMore = useCallback(async () => {
    if (!hasMore || loadingRef.current) return;

    const oldestMessage = messages[0];
    if (oldestMessage) {
      await fetchMessages(messages.length);
    }
  }, [messages, hasMore, fetchMessages]);

  // 日付でグループ化
  const groupMessagesByDate = useCallback((msgs: Message[]): MessageGroup[] => {
    const groups = new Map<string, Message[]>();

    for(const msg of msgs) {
      // 削除されたメッセージも表示（削除済みという表示で）
      // ISO形式の日付文字列（YYYY-MM-DD）として保存
      const date = msg.createdAt.toISOString().split('T')[0];

      if (!groups.has(date)) {
        groups.set(date, []);
      }
      groups.get(date)?.push(msg);
    }

    return Array.from(groups.entries()).map(([date, messages]) => ({
      date,
      messages,
    }));
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    messageGroups: groupMessagesByDate(messages),
    isLoading,
    error,
    hasMore,
    sendMessage,
    updateMessage,
    deleteMessage,
    loadMore,
  };
}
