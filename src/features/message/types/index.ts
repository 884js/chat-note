// Message関連の型定義

export interface Message {
  id: string;
  roomId: string;
  content?: string;
  imageUri?: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

export interface SendMessageInput {
  roomId: string;
  content?: string;
  imageUri?: string;
}

export interface UpdateMessageInput {
  id: string;
  content?: string;
}

export interface MessageGroup {
  date: string; // YYYY-MM-DD形式
  messages: Message[];
}

export type MessageStatus = 'sending' | 'sent' | 'failed';

export interface OptimisticMessage extends Message {
  status: MessageStatus;
  tempId?: string;
}
