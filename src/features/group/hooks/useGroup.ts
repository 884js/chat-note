import { useCallback, useEffect, useState } from 'react';
import { groupRepository } from '@/lib/database';
import { useDatabase } from '@/lib/database';
import type { Group } from '../types';

type Props = {
  groupId: string;
};

export const useGroup = ({ groupId }: Props) => {
  const { database, isReady } = useDatabase();
  const [group, setGroup] = useState<Group | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // グループ取得
  const getGroupDetail = useCallback(
    async ({ groupId }: { groupId: string }) => {
      if (!isReady || !database) {
        return null;
      }

      try {
        const group = await groupRepository.getGroupById(groupId);
        return group;
      } catch (err) {
        console.error('Failed to fetch group:', err);
        setError(err as Error);
        return null;
      }
    },
    [isReady, database],
  );

  useEffect(() => {
    const fetchGroup = async () => {
      const group = await getGroupDetail({ groupId });
      setGroup(group);
    };
    fetchGroup();
  }, [getGroupDetail, groupId]);

  return { group, error };
};
