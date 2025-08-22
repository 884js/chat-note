import { useState, useEffect, useCallback, useRef } from 'react';
import type { Memo, SendMemoInput, MemoGroup } from '../types';

// モックデータ（後でSQLiteに置き換え）
const MOCK_MEMOS: Memo[] = [
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

export function useMemos(roomId: string) {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);

  // メモ取得
  const fetchMemos = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    try {
      // 実際の実装では SQLite からデータを取得
      await new Promise((resolve) => setTimeout(resolve, 300)); // 仮の遅延

      const roomMemos = MOCK_MEMOS.filter((m) => m.roomId === roomId);
      const sortedMemos = roomMemos.sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
      );

      setMemos(sortedMemos);
      setHasMore(false); // モックなので追加読み込みなし
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, [roomId]);

  // メモ送信
  const sendMemo = useCallback(async (input: SendMemoInput) => {
    try {
      const newMemo: Memo = {
        id: Date.now().toString(),
        roomId: input.roomId,
        content: input.content,
        imageUri: input.imageUri,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      };

      setMemos((prev) => [...prev, newMemo]);
      return newMemo;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  // メモ編集
  const updateMemo = useCallback(async (memoId: string, content: string) => {
    try {
      setMemos((prev) =>
        prev.map((memo) =>
          memo.id === memoId
            ? { ...memo, content, updatedAt: new Date() }
            : memo,
        ),
      );
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  // メモ削除（論理削除）
  const deleteMemo = useCallback(async (memoId: string) => {
    try {
      setMemos((prev) =>
        prev.map((memo) =>
          memo.id === memoId
            ? { ...memo, isDeleted: true, updatedAt: new Date() }
            : memo,
        ),
      );
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  // 古いメモを読み込む
  const loadMore = useCallback(async () => {
    if (!hasMore || loadingRef.current) return;

    const oldestMemo = memos[0];
    if (oldestMemo) {
      await fetchMemos();
    }
  }, [memos, hasMore, fetchMemos]);

  // 日付でグループ化
  const groupMemosByDate = useCallback((memoList: Memo[]): MemoGroup[] => {
    const groups = new Map<string, Memo[]>();

    for (const memo of memoList) {
      // 削除されたメモも表示（削除済みという表示で）
      // ISO形式の日付文字列（YYYY-MM-DD）として保存
      const date = memo.createdAt.toISOString().split('T')[0];

      if (!groups.has(date)) {
        groups.set(date, []);
      }
      groups.get(date)?.push(memo);
    }

    return Array.from(groups.entries()).map(([date, memos]) => ({
      date,
      memos,
    }));
  }, []);

  useEffect(() => {
    fetchMemos();
  }, [fetchMemos]);

  return {
    memos,
    memoGroups: groupMemosByDate(memos),
    isLoading,
    error,
    hasMore,
    sendMemo,
    updateMemo,
    deleteMemo,
    loadMore,
  };
}
