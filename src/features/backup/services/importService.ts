import { openDatabase } from '@/lib/database/db';
import { groups, memos } from '@/lib/database/schema';
import { eq } from 'drizzle-orm';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import type { BackupData, ImportOptions, ImportResult } from '../types';

/**
 * バックアップデータをインポート
 */
export async function importBackupData(
  options: ImportOptions = { duplicateStrategy: 'skip' },
): Promise<ImportResult> {
  try {
    // ファイルを選択
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      return {
        success: false,
        groupsImported: 0,
        memosImported: 0,
        groupsSkipped: 0,
        memosSkipped: 0,
        error: 'ファイル選択がキャンセルされました',
      };
    }

    // ファイルを読み込み
    const fileContent = await FileSystem.readAsStringAsync(
      result.assets[0].uri,
    );
    const backupData = JSON.parse(fileContent) as BackupData;

    // データのバリデーション
    if (!validateBackupData(backupData)) {
      return {
        success: false,
        groupsImported: 0,
        memosImported: 0,
        groupsSkipped: 0,
        memosSkipped: 0,
        error: '無効なバックアップファイルです',
      };
    }

    const db = await openDatabase();
    let groupsImported = 0;
    let memosImported = 0;
    let groupsSkipped = 0;
    let memosSkipped = 0;

    // 既存データをクリア（オプション）
    if (options.clearExisting) {
      await db.delete(memos);
      await db.delete(groups);
    }

    // グループのインポート
    for (const group of backupData.groups) {
      try {
        const existingGroup = await db
          .select()
          .from(groups)
          .where(eq(groups.id, group.id))
          .limit(1);

        if (existingGroup.length > 0) {
          if (options.duplicateStrategy === 'skip') {
            groupsSkipped++;
          } else if (options.duplicateStrategy === 'overwrite') {
            await db
              .update(groups)
              .set({
                name: group.name,
                description: group.description,
                color: group.color,
                icon: group.icon,
                isArchived: group.isArchived,
                updatedAt: new Date(),
              })
              .where(eq(groups.id, group.id));
            groupsImported++;
          } else if (options.duplicateStrategy === 'rename') {
            const newId = `${group.id}-imported-${Date.now()}`;
            await db.insert(groups).values({
              ...group,
              id: newId,
              name: `${group.name} (インポート)`,
              createdAt: new Date(group.createdAt),
              updatedAt: new Date(),
            });

            // 関連するメモのgroupIdも更新
            backupData.memos = backupData.memos.map((memo) =>
              memo.groupId === group.id ? { ...memo, groupId: newId } : memo,
            );
            groupsImported++;
          }
        } else {
          await db.insert(groups).values({
            ...group,
            createdAt: new Date(group.createdAt),
            updatedAt: new Date(group.updatedAt),
          });
          groupsImported++;
        }
      } catch (error) {
        console.error('グループインポートエラー:', error);
        groupsSkipped++;
      }
    }

    // メモのインポート
    for (const memo of backupData.memos) {
      try {
        const existingMemo = await db
          .select()
          .from(memos)
          .where(eq(memos.id, memo.id))
          .limit(1);

        if (existingMemo.length > 0) {
          if (options.duplicateStrategy === 'skip') {
            memosSkipped++;
          } else if (options.duplicateStrategy === 'overwrite') {
            await db
              .update(memos)
              .set({
                content: memo.content,
                imageUri: memo.imageUri,
                isDeleted: memo.isDeleted,
                updatedAt: new Date(),
              })
              .where(eq(memos.id, memo.id));
            memosImported++;
          } else if (options.duplicateStrategy === 'rename') {
            const newId = `${memo.id}-imported-${Date.now()}`;
            await db.insert(memos).values({
              ...memo,
              id: newId,
              createdAt: new Date(memo.createdAt),
              updatedAt: new Date(),
            });
            memosImported++;
          }
        } else {
          // グループが存在するか確認
          const groupExists = await db
            .select()
            .from(groups)
            .where(eq(groups.id, memo.groupId))
            .limit(1);

          if (groupExists.length > 0) {
            await db.insert(memos).values({
              ...memo,
              createdAt: new Date(memo.createdAt),
              updatedAt: new Date(memo.updatedAt),
            });
            memosImported++;
          } else {
            memosSkipped++;
          }
        }
      } catch (error) {
        console.error('メモインポートエラー:', error);
        memosSkipped++;
      }
    }

    return {
      success: true,
      groupsImported,
      memosImported,
      groupsSkipped,
      memosSkipped,
    };
  } catch (error) {
    console.error('インポートエラー:', error);
    return {
      success: false,
      groupsImported: 0,
      memosImported: 0,
      groupsSkipped: 0,
      memosSkipped: 0,
      error:
        error instanceof Error ? error.message : 'インポートに失敗しました',
    };
  }
}

/**
 * バックアップデータの妥当性を検証
 */
function validateBackupData(data: unknown): data is BackupData {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const obj = data as Record<string, unknown>;

  if (!obj.version || typeof obj.version !== 'string') {
    return false;
  }

  if (!obj.exportedAt || typeof obj.exportedAt !== 'string') {
    return false;
  }

  if (!Array.isArray(obj.groups)) {
    return false;
  }

  if (!Array.isArray(obj.memos)) {
    return false;
  }

  // バージョンチェック（現在は1.0.0のみサポート）
  const version = obj.version as string;
  if (!version.startsWith('1.')) {
    return false;
  }

  return true;
}

/**
 * インポート前のプレビュー情報を取得
 */
export async function previewImport(fileUri: string): Promise<{
  valid: boolean;
  groupCount?: number;
  memoCount?: number;
  exportDate?: string;
  version?: string;
  error?: string;
}> {
  try {
    const fileContent = await FileSystem.readAsStringAsync(fileUri);
    const backupData = JSON.parse(fileContent) as BackupData;

    if (!validateBackupData(backupData)) {
      return {
        valid: false,
        error: '無効なバックアップファイルです',
      };
    }

    return {
      valid: true,
      groupCount: backupData.groups.length,
      memoCount: backupData.memos.length,
      exportDate: backupData.exportedAt,
      version: backupData.version,
    };
  } catch (error) {
    return {
      valid: false,
      error: 'ファイルの読み込みに失敗しました',
    };
  }
}
