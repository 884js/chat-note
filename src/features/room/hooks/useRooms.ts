import { useState, useEffect, useCallback } from 'react';
import type { RoomWithLastMessage, RoomSortOrder } from '../types';

// モックデータ（後でSQLiteに置き換え）
const MOCK_ROOMS: RoomWithLastMessage[] = [
  {
    id: '1',
    name: 'アイデアメモ',
    description: 'ひらめいたアイデアをすぐにメモ',
    color: 'blue',
    icon: '💡',
    lastMessage: '新しいアプリのコンセプト...',
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 5), // 5分前
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
    lastMessage: '牛乳、パン、卵',
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2時間前
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: '3',
    name: '仕事のタスク',
    description: '今日やることリスト',
    color: 'purple',
    icon: '📋',
    lastMessage: 'プレゼン資料の作成',
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1日前
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];

export function useRooms(sortOrder: RoomSortOrder = 'lastUpdated') {
  const [rooms, setRooms] = useState<RoomWithLastMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // ルーム取得
  const fetchRooms = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 実際の実装では SQLite からデータを取得
      await new Promise(resolve => setTimeout(resolve, 500)); // 仮の遅延
      
      let sortedRooms = [...MOCK_ROOMS];
      
      // ソート処理
      switch (sortOrder) {
        case 'lastUpdated':
          sortedRooms.sort((a, b) => 
            (b.lastMessageAt?.getTime() || 0) - (a.lastMessageAt?.getTime() || 0)
          );
          break;
        case 'alphabetical':
          sortedRooms.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'createdAt':
          sortedRooms.sort((a, b) => 
            b.createdAt.getTime() - a.createdAt.getTime()
          );
          break;
      }
      
      setRooms(sortedRooms);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [sortOrder]);

  // ルーム作成
  const createRoom = useCallback(async (room: Partial<RoomWithLastMessage>) => {
    try {
      const newRoom: RoomWithLastMessage = {
        id: Date.now().toString(),
        name: room.name || '新しいメモ',
        description: room.description,
        color: room.color || 'blue',
        icon: room.icon,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setRooms(prev => [newRoom, ...prev]);
      return newRoom;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  // ルーム削除
  const deleteRoom = useCallback(async (roomId: string) => {
    try {
      setRooms(prev => prev.filter(room => room.id !== roomId));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  // リフレッシュ
  const refetch = useCallback(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return {
    rooms,
    isLoading,
    error,
    createRoom,
    deleteRoom,
    refetch,
  };
}