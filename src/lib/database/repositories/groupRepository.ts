import {
  runAsync,
  getAllAsync,
  getFirstAsync,
  withTransaction,
} from '../database';
import type {
  Group,
  GroupWithLastMemo,
  CreateGroupInput,
  UpdateGroupInput,
} from '@/features/group/types';

/**
 * グループをデータベースレコードからエンティティに変換
 */
function mapRowToGroup(row: any): Group {
  return {
    id: row.id,
    name: row.name,
    description: row.description || undefined,
    color: row.color,
    icon: row.icon || undefined,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}

/**
 * グループと最新メモ情報をマップ
 */
function mapRowToGroupWithLastMemo(row: any): GroupWithLastMemo {
  return {
    ...mapRowToGroup(row),
    lastMemo: row.lastMemo || undefined,
    lastMemoAt: row.lastMemoAt ? new Date(row.lastMemoAt) : undefined,
    unreadCount: row.unreadCount || 0,
  };
}

/**
 * すべてのグループを取得（最新メモ情報付き）
 */
export async function getAllGroups(): Promise<GroupWithLastMemo[]> {
  const query = `
    SELECT 
      g.*,
      m.content as lastMemo,
      m.createdAt as lastMemoAt,
      0 as unreadCount
    FROM groups g
    LEFT JOIN (
      SELECT groupId, content, createdAt
      FROM memos
      WHERE isDeleted = 0
      AND (groupId, createdAt) IN (
        SELECT groupId, MAX(createdAt)
        FROM memos
        WHERE isDeleted = 0
        GROUP BY groupId
      )
    ) m ON g.id = m.groupId
    ORDER BY COALESCE(m.createdAt, g.updatedAt) DESC;
  `;

  const rows = await getAllAsync(query);
  return rows.map(mapRowToGroupWithLastMemo);
}

/**
 * 特定のグループを取得
 */
export async function getGroupById(id: string): Promise<Group | null> {
  const query = `SELECT * FROM groups WHERE id = ?;`;
  const row = await getFirstAsync(query, [id]);

  if (!row) {
    return null;
  }

  return mapRowToGroup(row);
}

/**
 * グループを作成
 */
export async function createGroup(input: CreateGroupInput): Promise<Group> {
  const id = `group-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const now = Date.now();

  const query = `
    INSERT INTO groups (id, name, description, color, icon, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?);
  `;

  await runAsync(query, [
    id,
    input.name,
    input.description || null,
    input.color,
    input.icon || null,
    now,
    now,
  ]);

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
  // 更新するフィールドを動的に構築
  const fields: string[] = [];
  const values: any[] = [];

  if (input.name !== undefined) {
    fields.push('name = ?');
    values.push(input.name);
  }

  if (input.description !== undefined) {
    fields.push('description = ?');
    values.push(input.description || null);
  }

  if (input.color !== undefined) {
    fields.push('color = ?');
    values.push(input.color);
  }

  if (input.icon !== undefined) {
    fields.push('icon = ?');
    values.push(input.icon || null);
  }

  // 更新日時を追加
  fields.push('updatedAt = ?');
  values.push(Date.now());

  // IDを最後に追加
  values.push(input.id);

  const query = `
    UPDATE groups
    SET ${fields.join(', ')}
    WHERE id = ?;
  `;

  await runAsync(query, values);

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
  await withTransaction(async () => {
    // 外部キー制約により、関連するメモも自動的に削除される
    const query = `DELETE FROM groups WHERE id = ?;`;
    await runAsync(query, [id]);
  });
}

/**
 * グループ名の重複をチェック
 */
export async function isGroupNameDuplicate(
  name: string,
  excludeId?: string,
): Promise<boolean> {
  let query = `SELECT COUNT(*) as count FROM groups WHERE name = ?`;
  const params: any[] = [name];

  if (excludeId) {
    query += ` AND id != ?`;
    params.push(excludeId);
  }

  const result = await getFirstAsync<{ count: number }>(query, params);
  return (result?.count || 0) > 0;
}

/**
 * グループ数を取得
 */
export async function getGroupCount(): Promise<number> {
  const result = await getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM groups;`,
  );
  return result?.count || 0;
}
