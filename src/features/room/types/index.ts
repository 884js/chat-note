// Room関連の型定義

export interface Room {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoomWithLastMessage extends Room {
  lastMessage?: string;
  lastMessageAt?: Date;
  unreadCount?: number;
}

export interface CreateRoomInput {
  name: string;
  description?: string;
  color: string;
  icon?: string;
}

export interface UpdateRoomInput extends Partial<CreateRoomInput> {
  id: string;
}

export type RoomColor =
  | 'blue'
  | 'purple'
  | 'green'
  | 'orange'
  | 'pink'
  | 'red'
  | 'yellow'
  | 'gray';

export type RoomSortOrder = 'lastUpdated' | 'alphabetical' | 'createdAt';
