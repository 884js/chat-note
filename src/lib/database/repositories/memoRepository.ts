import type {
  Memo,
  SendMemoInput,
  UpdateMemoInput,
} from '@/features/memo/types';
import { and, asc, desc, eq, gte, like, lte, sql } from 'drizzle-orm';
import { getSQLiteDatabase, openDatabase } from '../db';
import { groups, memos } from '../schema';

/**
 * メモをデータベースレコードからエンティティに変換
 */
function mapRowToMemo(row: typeof memos.$inferSelect): Memo {
  return {
    id: row.id,
    groupId: row.groupId,
    content: row.content || undefined,
    imageUri: row.imageUri || undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    isDeleted: row.isDeleted,
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
  const db = await openDatabase();

  const result = await db
    .select()
    .from(memos)
    .where(and(eq(memos.groupId, groupId), eq(memos.isDeleted, false)))
    .orderBy(asc(memos.createdAt))
    .limit(limit)
    .offset(offset);

  return result.map(mapRowToMemo);
}

/**
 * 特定のメモを取得
 */
export async function getMemoById(id: string): Promise<Memo | null> {
  const db = await openDatabase();

  const result = await db
    .select()
    .from(memos)
    .where(and(eq(memos.id, id), eq(memos.isDeleted, false)))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  return mapRowToMemo(result[0]);
}

/**
 * メモを作成
 */
export async function createMemo(input: SendMemoInput): Promise<Memo> {
  const db = await openDatabase();
  const sqliteDb = getSQLiteDatabase();
  const id = `memo-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const now = new Date();

  if (!sqliteDb) {
    throw new Error('Database not initialized');
  }

  // トランザクションでメモの挿入とグループの更新を実行
  await db.transaction(async (tx) => {
    // メモを挿入
    await tx.insert(memos).values({
      id,
      groupId: input.groupId,
      content: input.content || null,
      imageUri: input.imageUri || null,
      createdAt: now,
      updatedAt: now,
      isDeleted: false,
    });

    // グループの更新日時を更新
    await tx
      .update(groups)
      .set({ updatedAt: now })
      .where(eq(groups.id, input.groupId));
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
  const db = await openDatabase();
  const now = new Date();

  await db
    .update(memos)
    .set({
      content: input.content || null,
      updatedAt: now,
    })
    .where(and(eq(memos.id, input.id), eq(memos.isDeleted, false)));

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
  const db = await openDatabase();
  const now = new Date();

  await db
    .update(memos)
    .set({
      isDeleted: true,
      updatedAt: now,
    })
    .where(eq(memos.id, id));
}

/**
 * メモを物理削除（完全削除）
 */
export async function hardDeleteMemo(id: string): Promise<void> {
  const db = await openDatabase();

  await db.delete(memos).where(eq(memos.id, id));
}

/**
 * グループの最新メモを取得
 */
export async function getLatestMemoByGroupId(
  groupId: string,
): Promise<Memo | null> {
  const db = await openDatabase();

  const result = await db
    .select()
    .from(memos)
    .where(and(eq(memos.groupId, groupId), eq(memos.isDeleted, false)))
    .orderBy(desc(memos.createdAt))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  return mapRowToMemo(result[0]);
}

/**
 * グループのメモ数を取得
 */
export async function getMemoCountByGroupId(groupId: string): Promise<number> {
  const db = await openDatabase();

  const result = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(memos)
    .where(and(eq(memos.groupId, groupId), eq(memos.isDeleted, false)));

  return result[0]?.count || 0;
}

/**
 * 日付範囲でメモを検索
 */
export async function searchMemosByDateRange(
  groupId: string,
  startDate: Date,
  endDate: Date,
): Promise<Memo[]> {
  const db = await openDatabase();

  const result = await db
    .select()
    .from(memos)
    .where(
      and(
        eq(memos.groupId, groupId),
        eq(memos.isDeleted, false),
        gte(memos.createdAt, startDate),
        lte(memos.createdAt, endDate),
      ),
    )
    .orderBy(asc(memos.createdAt));

  return result.map(mapRowToMemo);
}

/**
 * テキスト検索
 */
export async function searchMemosByText(
  groupId: string,
  searchText: string,
): Promise<Memo[]> {
  const db = await openDatabase();

  const result = await db
    .select()
    .from(memos)
    .where(
      and(
        eq(memos.groupId, groupId),
        eq(memos.isDeleted, false),
        like(memos.content, `%${searchText}%`),
      ),
    )
    .orderBy(asc(memos.createdAt));

  return result.map(mapRowToMemo);
}
