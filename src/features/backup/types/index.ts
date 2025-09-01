/**
 * バックアップ用のグループデータ
 */
export interface BackupGroup {
  id: string;
  name: string;
  description: string | null;
  color: string;
  icon: string | null;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * バックアップ用のメモデータ
 */
export interface BackupMemo {
  id: string;
  groupId: string;
  content: string | null;
  imageUri: string | null;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

/**
 * バックアップデータの構造
 */
export interface BackupData {
  /** バックアップフォーマットのバージョン */
  version: string;
  /** エクスポート日時 */
  exportedAt: string;
  /** グループデータ */
  groups: BackupGroup[];
  /** メモデータ */
  memos: BackupMemo[];
  /** 統計情報 */
  statistics?: {
    totalGroups: number;
    totalMemos: number;
    totalImages: number;
  };
}

/**
 * インポートオプション
 */
export interface ImportOptions {
  /** 重複データの処理方法 */
  duplicateStrategy: 'skip' | 'overwrite' | 'rename';
  /** 既存データを削除してからインポートするか */
  clearExisting?: boolean;
}

/**
 * インポート結果
 */
export interface ImportResult {
  /** 成功したか */
  success: boolean;
  /** インポートされたグループ数 */
  groupsImported: number;
  /** インポートされたメモ数 */
  memosImported: number;
  /** スキップされたグループ数 */
  groupsSkipped: number;
  /** スキップされたメモ数 */
  memosSkipped: number;
  /** エラーメッセージ */
  error?: string;
}

/**
 * エクスポート結果
 */
export interface ExportResult {
  /** 成功したか */
  success: boolean;
  /** エクスポートされたファイルパス */
  filePath?: string;
  /** エラーメッセージ */
  error?: string;
}

/**
 * バックアップ統計情報
 */
export interface BackupStatistics {
  /** 最終バックアップ日時 */
  lastBackupDate?: Date;
  /** グループ数 */
  totalGroups: number;
  /** メモ数 */
  totalMemos: number;
  /** アーカイブされたグループ数 */
  archivedGroups: number;
  /** 削除されたメモ数 */
  deletedMemos: number;
}
