import {
  runAsync,
  getAllAsync,
  getFirstAsync,
  withTransaction,
} from '../database';
import type {
  Memo,
  SendMemoInput,
  UpdateMemoInput,
} from '@/features/memo/types';

/**
 * メモをデータベースレコードからエンティティに変換
 */
function mapRowToMemo(row: any): Memo {
  return {
    id: row.id,
    groupId: row.groupId,
    content: row.content || undefined,
    imageUri: row.imageUri || undefined,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
    isDeleted: Boolean(row.isDeleted),
  };
}

/**
 * グループのメモを取得
 */
export async function getMemosByGroupId(
  groupId: string,
  limit = 50,
  offset = 0,
): Promise<Memo[]> {
  const query = `
    SELECT * FROM memos
    WHERE groupId = ? AND isDeleted = 0
    ORDER BY createdAt ASC
    LIMIT ? OFFSET ?;
  `;

  const rows = await getAllAsync(query, [groupId, limit, offset]);
  return rows.map(mapRowToMemo);
}

/**
 * 特定のメモを取得
 */
export async function getMemoById(id: string): Promise<Memo | null> {
  const query = `SELECT * FROM memos WHERE id = ? AND isDeleted = 0;`;
  const row = await getFirstAsync(query, [id]);

  if (!row) {
    return null;
  }

  return mapRowToMemo(row);
}

/**
 * メモを作成
 */
export async function createMemo(input: SendMemoInput): Promise<Memo> {
  const id = `memo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const now = Date.now();

  const query = `
    INSERT INTO memos (id, groupId, content, imageUri, createdAt, updatedAt, isDeleted)
    VALUES (?, ?, ?, ?, ?, ?, ?);
  `;

  await withTransaction(async () => {
    // メモを挿入
    await runAsync(query, [
      id,
      input.groupId,
      input.content || null,
      input.imageUri || null,
      now,
      now,
      0,
    ]);

    // グループの更新日時を更新
    await runAsync(`UPDATE groups SET updatedAt = ? WHERE id = ?;`, [
      now,
      input.groupId,
    ]);
  });

  const created = await getMemoById(id);
  if (!created) {
    throw new Error('Failed to create memo');
  }

  return created;
}

/**
 * メモを更新
 */
export async function updateMemo(input: UpdateMemoInput): Promise<Memo> {
  const now = Date.now();

  const query = `
    UPDATE memos
    SET content = ?, updatedAt = ?
    WHERE id = ? AND isDeleted = 0;
  `;

  await runAsync(query, [input.content || null, now, input.id]);

  const updated = await getMemoById(input.id);
  if (!updated) {
    throw new Error('Memo not found');
  }

  return updated;
}

/**
 * メモを削除（論理削除）
 */
export async function deleteMemo(id: string): Promise<void> {
  const now = Date.now();

  const query = `
    UPDATE memos
    SET isDeleted = 1, updatedAt = ?
    WHERE id = ?;
  `;

  await runAsync(query, [now, id]);
}

/**
 * メモを物理削除（完全削除）
 */
export async function hardDeleteMemo(id: string): Promise<void> {
  const query = `DELETE FROM memos WHERE id = ?;`;
  await runAsync(query, [id]);
}

/**
 * グループの最新メモを取得
 */
export async function getLatestMemoByGroupId(
  groupId: string,
): Promise<Memo | null> {
  const query = `
    SELECT * FROM memos
    WHERE groupId = ? AND isDeleted = 0
    ORDER BY createdAt DESC
    LIMIT 1;
  `;

  const row = await getFirstAsync(query, [groupId]);

  if (!row) {
    return null;
  }

  return mapRowToMemo(row);
}

/**
 * グループのメモ数を取得
 */
export async function getMemoCountByGroupId(groupId: string): Promise<number> {
  const result = await getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM memos WHERE groupId = ? AND isDeleted = 0;`,
    [groupId],
  );
  return result?.count || 0;
}

/**
 * 日付範囲でメモを検索
 */
export async function searchMemosByDateRange(
  groupId: string,
  startDate: Date,
  endDate: Date,
): Promise<Memo[]> {
  const query = `
    SELECT * FROM memos
    WHERE groupId = ? 
      AND isDeleted = 0
      AND createdAt >= ?
      AND createdAt <= ?
    ORDER BY createdAt ASC;
  `;

  const rows = await getAllAsync(query, [
    groupId,
    startDate.getTime(),
    endDate.getTime(),
  ]);

  return rows.map(mapRowToMemo);
}

/**
 * テキスト検索
 */
export async function searchMemosByText(
  groupId: string,
  searchText: string,
): Promise<Memo[]> {
  const query = `
    SELECT * FROM memos
    WHERE groupId = ? 
      AND isDeleted = 0
      AND content LIKE ?
    ORDER BY createdAt ASC;
  `;

  const rows = await getAllAsync(query, [groupId, `%${searchText}%`]);

  return rows.map(mapRowToMemo);
}
