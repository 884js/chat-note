// Memo関連の型定義

export interface Memo {
  id: string;
  roomId: string;
  content?: string;
  imageUri?: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

export interface SendMemoInput {
  roomId: string;
  content?: string;
  imageUri?: string;
}

export interface UpdateMemoInput {
  id: string;
  content?: string;
}

export interface MemoGroup {
  date: string; // YYYY-MM-DD形式
  memos: Memo[];
}

export type MemoStatus = 'sending' | 'sent' | 'failed';

export interface OptimisticMemo extends Memo {
  status: MemoStatus;
  tempId?: string;
}
