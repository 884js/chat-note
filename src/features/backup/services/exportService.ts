import type { Group } from '@/features/group/types';
import type { Memo } from '@/features/memo/types';
import { getAllGroupsForExport } from '@/lib/database/repositories/groupRepository';
import { getAllMemosForExport } from '@/lib/database/repositories/memoRepository';
import { format } from 'date-fns';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import type {
  BackupData,
  BackupGroup,
  BackupMemo,
  ExportResult,
} from '../types';

// ========================================
// 定数
// ========================================

const BACKUP_VERSION = '1.0.0';
const FILE_PREFIX = 'chatmemo_backup';
const DATE_FORMAT = 'yyyyMMdd_HHmmss';
const JSON_MIME_TYPE = 'application/json';
const JSON_UTI = 'public.json';
const BACKUP_DIR_NAME = 'backups';

const ERROR_MESSAGES = {
  SAVE_CANCELLED: '保存先の選択がキャンセルされました',
  SAVE_FAILED: 'デバイスへの保存に失敗しました',
  SHARE_FAILED: '共有に失敗しました',
  SIZE_CALC_FAILED: 'サイズ計算エラー',
  EXPORT_CHECK_FAILED: 'エクスポート可能性チェックエラー',
} as const;

// ========================================
// データ変換ヘルパー関数
// ========================================

/**
 * グループデータをバックアップ形式に変換
 */
function convertGroupToBackup(group: Group): BackupGroup {
  return {
    id: group.id,
    name: group.name,
    description: group.description ?? null,
    color: group.color,
    icon: group.icon ?? null,
    isArchived: group.isArchived ?? false,
    createdAt: group.createdAt,
    updatedAt: group.updatedAt,
  };
}

/**
 * メモデータをバックアップ形式に変換
 */
function convertMemoToBackup(memo: Memo): BackupMemo {
  return {
    id: memo.id,
    groupId: memo.groupId,
    content: memo.content ?? null,
    imageUri: memo.imageUri ?? null,
    createdAt: memo.createdAt,
    updatedAt: memo.updatedAt,
    isDeleted: memo.isDeleted,
  };
}

/**
 * データベースからバックアップデータを構築
 */
async function buildBackupData(
  groups: Group[],
  memos: Memo[],
): Promise<BackupData> {
  const backupGroups = groups.map(convertGroupToBackup);
  const backupMemos = memos.map(convertMemoToBackup);

  return {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    groups: backupGroups,
    memos: backupMemos,
    statistics: {
      totalGroups: backupGroups.length,
      totalMemos: backupMemos.length,
      totalImages: backupMemos.filter((m) => m.imageUri).length,
    },
  };
}

/**
 * バックアップファイル名を生成
 */
function generateFileName(): string {
  const timestamp = format(new Date(), DATE_FORMAT);
  return `${FILE_PREFIX}_${timestamp}.json`;
}

// ========================================
// ファイル操作ヘルパー関数
// ========================================

/**
 * JSONデータをファイルに書き込む
 */
async function writeJsonToFile(
  filePath: string,
  data: BackupData,
): Promise<void> {
  const jsonContent = JSON.stringify(data, null, 2);
  await FileSystem.writeAsStringAsync(filePath, jsonContent, {
    encoding: FileSystem.EncodingType.UTF8,
  });
}

/**
 * バックアップディレクトリを確保（iOS用）
 */
async function ensureBackupDirectory(): Promise<string> {
  const backupsDir = `${FileSystem.documentDirectory}${BACKUP_DIR_NAME}/`;
  const dirInfo = await FileSystem.getInfoAsync(backupsDir);

  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(backupsDir, { intermediates: true });
  }

  return backupsDir;
}

// ========================================
// プラットフォーム固有の保存処理
// ========================================

/**
 * Android向けの保存処理
 */
async function saveToAndroid(
  fileName: string,
  data: BackupData,
): Promise<ExportResult> {
  const permissions =
    await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

  if (!permissions.granted) {
    return {
      success: false,
      error: ERROR_MESSAGES.SAVE_CANCELLED,
    };
  }

  const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
    permissions.directoryUri,
    fileName,
    JSON_MIME_TYPE,
  );

  await writeJsonToFile(fileUri, data);

  return {
    success: true,
    filePath: fileUri,
  };
}

/**
 * iOS向けの保存処理
 */
async function saveToIOS(
  fileName: string,
  data: BackupData,
): Promise<ExportResult> {
  const backupsDir = await ensureBackupDirectory();
  const filePath = `${backupsDir}${fileName}`;

  await writeJsonToFile(filePath, data);

  return {
    success: true,
    filePath,
  };
}

// ========================================
// メイン機能
// ========================================

/**
 * バックアップデータを準備
 */
export async function prepareBackupData(): Promise<{
  data: BackupData;
  fileName: string;
}> {
  const [groups, memos] = await Promise.all([
    getAllGroupsForExport(),
    getAllMemosForExport(),
  ]);

  const data = await buildBackupData(groups, memos);
  const fileName = generateFileName();

  return { data, fileName };
}

/**
 * バックアップデータをデバイスに保存
 */
export async function saveBackupToDevice(): Promise<ExportResult> {
  try {
    const { data, fileName } = await prepareBackupData();

    // プラットフォームに応じた保存処理
    if (Platform.OS === 'android') {
      return await saveToAndroid(fileName, data);
    }

    return await saveToIOS(fileName, data);
  } catch (error) {
    console.error('保存エラー:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : ERROR_MESSAGES.SAVE_FAILED,
    };
  }
}

/**
 * バックアップデータを共有
 */
export async function shareBackup(): Promise<ExportResult> {
  try {
    const { data, fileName } = await prepareBackupData();
    const tempFilePath = `${FileSystem.documentDirectory}${fileName}`;

    // 一時ファイルとして保存
    await writeJsonToFile(tempFilePath, data);

    // 共有ダイアログを表示
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(tempFilePath, {
        UTI: JSON_UTI,
        mimeType: JSON_MIME_TYPE,
        dialogTitle: 'バックアップファイルを共有',
      });
    }

    return {
      success: true,
      filePath: tempFilePath,
    };
  } catch (error) {
    console.error('共有エラー:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : ERROR_MESSAGES.SHARE_FAILED,
    };
  }
}

/**
 * バックアップファイルのサイズを計算
 */
export async function calculateBackupSize(): Promise<number> {
  try {
    const { data } = await prepareBackupData();
    const jsonString = JSON.stringify(data);

    // Blobがない環境では文字列のバイト数を計算
    if (typeof Blob !== 'undefined') {
      return new Blob([jsonString]).size;
    }

    // UTF-8でエンコードされた文字列のバイト数を計算
    return new TextEncoder().encode(jsonString).length;
  } catch (error) {
    console.error(ERROR_MESSAGES.SIZE_CALC_FAILED, error);
    return 0;
  }
}

/**
 * エクスポート可能かチェック
 */
export async function canExport(): Promise<boolean> {
  try {
    const groups = await getAllGroupsForExport();
    return groups.length > 0;
  } catch (error) {
    console.error(ERROR_MESSAGES.EXPORT_CHECK_FAILED, error);
    return false;
  }
}
