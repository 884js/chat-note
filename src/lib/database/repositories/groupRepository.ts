import type {
  CreateGroupInput,
  Group,
  GroupWithLastMemo,
  UpdateGroupInput,
} from '@/features/group/types';
import { and, desc, eq, ne, sql } from 'drizzle-orm';
import { openDatabase } from '../db';
import { groups, memos } from '../schema';

/**
 * グループをデータベースレコードからエンティティに変換
 */
function mapRowToGroup(row: typeof groups.$inferSelect): Group {
  return {
    id: row.id,
    name: row.name,
    description: row.description || undefined,
    color: row.color,
    icon: row.icon || undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

/**
 * すべてのグループを取得（最新メモ情報付き）
 */
export async function getAllGroups(): Promise<GroupWithLastMemo[]> {
  const db = await openDatabase();

  // すべてのグループを取得
  const allGroups = await db.select().from(groups);

  // 各グループの最新メモを取得
  const groupsWithLastMemo = await Promise.all(
    allGroups.map(async (group) => {
      const latestMemo = await db
        .select()
        .from(memos)
        .where(and(eq(memos.groupId, group.id), eq(memos.isDeleted, false)))
        .orderBy(desc(memos.createdAt))
        .limit(1);

      return {
        ...mapRowToGroup(group),
        lastMemo: latestMemo[0]?.content || undefined,
        lastMemoAt: latestMemo[0]?.createdAt || undefined,
        unreadCount: 0,
      };
    }),
  );

  // 最終メモ日時または更新日時でソート
  return groupsWithLastMemo.sort((a, b) => {
    const aTime = (a.lastMemoAt || a.updatedAt).getTime();
    const bTime = (b.lastMemoAt || b.updatedAt).getTime();
    return bTime - aTime;
  });
}

/**
 * 特定のグループを取得
 */
export async function getGroupById(id: string): Promise<Group | null> {
  const db = await openDatabase();

  const result = await db
    .select()
    .from(groups)
    .where(eq(groups.id, id))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  return mapRowToGroup(result[0]);
}

/**
 * グループを作成
 */
export async function createGroup(input: CreateGroupInput): Promise<Group> {
  const db = await openDatabase();
  const id = `group-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const now = new Date();

  await db.insert(groups).values({
    id,
    name: input.name,
    description: input.description || null,
    color: input.color,
    icon: input.icon || null,
    createdAt: now,
    updatedAt: now,
  });

  const created = await getGroupById(id);
  if (!created) {
    throw new Error('Failed to create group');
  }

  return created;
}

/**
 * グループを更新
 */
export async function updateGroup(input: UpdateGroupInput): Promise<Group> {
  const db = await openDatabase();
  const updateData: Partial<typeof groups.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (input.name !== undefined) {
    updateData.name = input.name;
  }

  if (input.description !== undefined) {
    updateData.description = input.description || null;
  }

  if (input.color !== undefined) {
    updateData.color = input.color;
  }

  if (input.icon !== undefined) {
    updateData.icon = input.icon || null;
  }

  await db.update(groups).set(updateData).where(eq(groups.id, input.id));

  const updated = await getGroupById(input.id);
  if (!updated) {
    throw new Error('Group not found');
  }

  return updated;
}

/**
 * グループを削除（関連するメモも削除）
 */
export async function deleteGroup(id: string): Promise<void> {
  const db = await openDatabase();

  // 外部キー制約により、関連するメモも自動的に削除される
  await db.delete(groups).where(eq(groups.id, id));
}

/**
 * グループ名の重複をチェック
 */
export async function isGroupNameDuplicate(
  name: string,
  excludeId?: string,
): Promise<boolean> {
  const db = await openDatabase();

  const conditions = [eq(groups.name, name)];
  if (excludeId) {
    conditions.push(ne(groups.id, excludeId));
  }

  const result = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(groups)
    .where(and(...conditions));

  return (result[0]?.count || 0) > 0;
}

/**
 * グループ数を取得
 */
export async function getGroupCount(): Promise<number> {
  const db = await openDatabase();

  const result = await db.select({ count: sql<number>`COUNT(*)` }).from(groups);

  return result[0]?.count || 0;
}
