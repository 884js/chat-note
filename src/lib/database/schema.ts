import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Groups テーブル定義
export const groups = sqliteTable(
  'groups',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    color: text('color').notNull(),
    icon: text('icon'),
    createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
  },
  (table) => ({
    updatedAtIdx: index('idx_groups_updatedAt').on(table.updatedAt),
  }),
);

// Memos テーブル定義
export const memos = sqliteTable(
  'memos',
  {
    id: text('id').primaryKey(),
    groupId: text('groupId')
      .notNull()
      .references(() => groups.id, { onDelete: 'cascade' }),
    content: text('content'),
    imageUri: text('imageUri'),
    createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
    isDeleted: integer('isDeleted', { mode: 'boolean' })
      .default(false)
      .notNull(),
  },
  (table) => [
    index('idx_memos_groupId').on(table.groupId),
    index('idx_memos_createdAt').on(table.createdAt),
  ],
);

// Migrations テーブル定義（バージョン管理用）
export const migrations = sqliteTable('migrations', {
  version: integer('version').primaryKey(),
  appliedAt: integer('appliedAt', { mode: 'timestamp' }).notNull(),
});

// 型推論用
export type Group = typeof groups.$inferSelect;
export type NewGroup = typeof groups.$inferInsert;
export type Memo = typeof memos.$inferSelect;
export type NewMemo = typeof memos.$inferInsert;
export type Migration = typeof migrations.$inferSelect;
