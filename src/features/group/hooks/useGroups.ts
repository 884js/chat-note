import { groupRepository } from '@/lib/database';
import { useDatabase } from '@/lib/database';
import { useCallback, useEffect, useState } from 'react';
import type {
  CreateGroupInput,
  GroupSortOrder,
  GroupWithLastMemo,
} from '../types';

export function useGroups(sortOrder: GroupSortOrder = 'lastUpdated') {
  const [groups, setGroups] = useState<GroupWithLastMemo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { database, isReady } = useDatabase();

  // グループ一覧取得
  const fetchGroups = useCallback(async () => {
    if (!isReady || !database) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // SQLiteからデータを取得
      const sortedGroups = await groupRepository.getAllGroups();

      // ソート処理
      switch (sortOrder) {
        case 'lastUpdated':
          sortedGroups.sort(
            (a, b) =>
              (b.lastMemoAt?.getTime() || b.updatedAt.getTime()) -
              (a.lastMemoAt?.getTime() || a.updatedAt.getTime()),
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
      console.error('Failed to fetch groups:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [sortOrder, isReady, database]);

  // グループ作成
  const createGroup = useCallback(
    async (input: CreateGroupInput) => {
      if (!database) {
        throw new Error('Database not ready');
      }

      try {
        const newGroup = await groupRepository.createGroup(input);

        // グループリストを再取得
        await fetchGroups();

        return newGroup;
      } catch (err) {
        console.error('Failed to create group:', err);
        setError(err as Error);
        throw err;
      }
    },
    [database, fetchGroups],
  );

  // グループ削除
  const deleteGroup = useCallback(
    async (groupId: string) => {
      if (!database) {
        throw new Error('Database not ready');
      }

      try {
        await groupRepository.deleteGroup(groupId);

        // グループリストを再取得
        await fetchGroups();
      } catch (err) {
        console.error('Failed to delete group:', err);
        setError(err as Error);
        throw err;
      }
    },
    [database, fetchGroups],
  );

  // グループアーカイブ
  const archiveGroup = useCallback(
    async (groupId: string) => {
      if (!database) {
        throw new Error('Database not ready');
      }

      try {
        await groupRepository.archiveGroup(groupId);

        // グループリストを再取得
        await fetchGroups();
      } catch (err) {
        console.error('Failed to archive group:', err);
        setError(err as Error);
        throw err;
      }
    },
    [database, fetchGroups],
  );

  // 単一グループ取得
  const getGroup = useCallback(
    async (groupId: string) => {
      if (!database) {
        throw new Error('Database not ready');
      }

      try {
        return await groupRepository.getGroupById(groupId);
      } catch (err) {
        console.error('Failed to get group:', err);
        setError(err as Error);
        throw err;
      }
    },
    [database],
  );

  // グループ更新
  const updateGroup = useCallback(
    async (groupId: string, input: Partial<CreateGroupInput>) => {
      if (!database) {
        throw new Error('Database not ready');
      }

      try {
        await groupRepository.updateGroup({
          id: groupId,
          ...input,
        });

        // グループリストを再取得
        await fetchGroups();
      } catch (err) {
        console.error('Failed to update group:', err);
        setError(err as Error);
        throw err;
      }
    },
    [database, fetchGroups],
  );

  // リフレッシュ
  const refetch = useCallback(() => {
    fetchGroups();
  }, [fetchGroups]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (isReady && database) {
      fetchGroups();
    }
  }, [isReady]); // databaseとfetchGroupsを依存配列から除外して不要な再実行を防ぐ

  return {
    groups,
    isLoading,
    error,
    createGroup,
    getGroup,
    updateGroup,
    deleteGroup,
    archiveGroup,
    refetch,
  };
}
