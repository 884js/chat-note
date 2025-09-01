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
    isArchived: integer('isArchived', { mode: 'boolean' })
      .default(false)
      .notNull(),
    createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
  },
  (table) => [
    index('idx_groups_updatedAt').on(table.updatedAt),
    index('idx_groups_isArchived').on(table.isArchived),
  ],
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

// 型推論用
export type Group = typeof groups.$inferSelect;
export type NewGroup = typeof groups.$inferInsert;
export type Memo = typeof memos.$inferSelect;
export type NewMemo = typeof memos.$inferInsert;
