import {
  createMemo,
  deleteMemo as deleteMemoFromDb,
  getMemosByGroupId,
  updateMemo as updateMemoInDb,
} from '@/lib/database/repositories/memoRepository';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Memo, MemoGroup, SendMemoInput } from '../types';

type Props = {
  groupId: string;
};

export function useMemos({ groupId }: Props) {
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
      // データベースからメモを取得
      const sortedMemos = await getMemosByGroupId(groupId);
      setMemos(sortedMemos);
      setHasMore(false); // 今のところページネーションなし
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, [groupId]);

  // メモ送信
  const sendMemo = useCallback(async (input: SendMemoInput) => {
    try {
      // データベースに保存
      const newMemo = await createMemo(input);

      // stateを更新（新しいメモを先頭に追加）
      setMemos((prev) => [newMemo, ...prev]);
      return newMemo;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  // メモ編集
  const updateMemo = useCallback(async (memoId: string, content: string) => {
    try {
      // データベースを更新
      const updatedMemo = await updateMemoInDb({ id: memoId, content });

      // stateを更新
      setMemos((prev) =>
        prev.map((memo) => (memo.id === memoId ? updatedMemo : memo)),
      );
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  // メモ削除（論理削除）
  const deleteMemo = useCallback(async (memoId: string) => {
    try {
      // データベースから削除（論理削除）
      await deleteMemoFromDb(memoId);

      // stateから削除（表示から消す）
      setMemos((prev) => prev.filter((memo) => memo.id !== memoId));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  // 古いメモを読み込む
  const loadMore = useCallback(async () => {
    if (!hasMore || loadingRef.current) return;

    const oldestMemo = memos[memos.length - 1];
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
