import { useState, useEffect, useCallback } from 'react';
import type { GroupWithLastMemo, GroupSortOrder } from '../types';

// モックデータ（後でSQLiteに置き換え）
const MOCK_GROUPS: GroupWithLastMemo[] = [
  {
    id: '1',
    name: 'アイデアメモ',
    description: 'ひらめいたアイデアをすぐにメモ',
    color: 'blue',
    icon: '💡',
    lastMemo: '新しいアプリのコンセプト...',
    lastMemoAt: new Date(Date.now() - 1000 * 60 * 5), // 5分前
    unreadCount: 2,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    updatedAt: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: '2',
    name: '買い物リスト',
    description: '買うものをメモ',
    color: 'green',
    icon: '🛒',
    lastMemo: '牛乳、パン、卵',
    lastMemoAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2時間前
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: '3',
    name: '仕事のタスク',
    description: '今日やることリスト',
    color: 'purple',
    icon: '📋',
    lastMemo: 'プレゼン資料の作成',
    lastMemoAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1日前
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];

export function useGroups(sortOrder: GroupSortOrder = 'lastUpdated') {
  const [groups, setGroups] = useState<GroupWithLastMemo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // グループ取得
  const fetchGroups = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 実際の実装では SQLite からデータを取得
      await new Promise((resolve) => setTimeout(resolve, 500)); // 仮の遅延

      let sortedGroups = [...MOCK_GROUPS];

      // ソート処理
      switch (sortOrder) {
        case 'lastUpdated':
          sortedGroups.sort(
            (a, b) =>
              (b.lastMemoAt?.getTime() || 0) - (a.lastMemoAt?.getTime() || 0),
          );
          break;
        case 'alphabetical':
          sortedGroups.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'createdAt':
          sortedGroups.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
          );
          break;
      }

      setGroups(sortedGroups);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [sortOrder]);

  // グループ作成
  const createGroup = useCallback(async (group: Partial<GroupWithLastMemo>) => {
    try {
      const newGroup: GroupWithLastMemo = {
        id: Date.now().toString(),
        name: group.name || '新しいグループ',
        description: group.description,
        color: group.color || 'blue',
        icon: group.icon,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setGroups((prev) => [newGroup, ...prev]);
      return newGroup;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  // グループ削除
  const deleteGroup = useCallback(async (groupId: string) => {
    try {
      setGroups((prev) => prev.filter((group) => group.id !== groupId));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  // リフレッシュ
  const refetch = useCallback(() => {
    fetchGroups();
  }, [fetchGroups]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return {
    groups,
    isLoading,
    error,
    createGroup,
    deleteGroup,
    refetch,
  };
}
