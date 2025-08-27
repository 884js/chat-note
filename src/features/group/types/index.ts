// Group関連の型定義

export interface Group {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  isArchived?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupWithLastMemo extends Group {
  lastMemo?: string;
  lastMemoAt?: Date;
  unreadCount?: number;
}

export interface CreateGroupInput {
  name: string;
  description?: string;
  color: string;
  icon?: string;
}

export interface UpdateGroupInput extends Partial<CreateGroupInput> {
  id: string;
}

export type GroupColor =
  | 'blue'
  | 'purple'
  | 'green'
  | 'orange'
  | 'pink'
  | 'red'
  | 'yellow'
  | 'gray';

export type GroupSortOrder = 'lastUpdated' | 'alphabetical' | 'createdAt';
