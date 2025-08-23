import { sql } from 'drizzle-orm';
import { getSQLiteDatabase, openDatabase } from './db';
import * as schema from './schema';

/**
 * マイグレーションを実行
 */
export async function runMigrations(): Promise<void> {
  console.log('Running migrations...');

  const db = await openDatabase();
  const sqliteDb = getSQLiteDatabase();

  if (!sqliteDb) {
    throw new Error('Database not initialized');
  }

  try {
    // Drizzle Kitが生成したマイグレーションを実行
    // 注意: React Native環境では動的importが制限されるため、
    // マイグレーションファイルを手動で管理する必要がある場合があります

    // 既存のテーブルが存在するか確認
    const tableExists = await sqliteDb.execute(
      `SELECT COUNT(*) as count FROM sqlite_master
      WHERE type='table' AND name='groups';`,
    );

    if (tableExists.rows?.[0]?.count === 0) {
      // 初回マイグレーション
      console.log('Creating initial tables...');

      // Groups テーブル作成
      sqliteDb.execute(`
        CREATE TABLE IF NOT EXISTS groups (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          color TEXT NOT NULL,
          icon TEXT,
          createdAt INTEGER NOT NULL,
          updatedAt INTEGER NOT NULL
        );
      `);

      // Memos テーブル作成
      sqliteDb.execute(`
        CREATE TABLE IF NOT EXISTS memos (
          id TEXT PRIMARY KEY,
          groupId TEXT NOT NULL,
          content TEXT,
          imageUri TEXT,
          createdAt INTEGER NOT NULL,
          updatedAt INTEGER NOT NULL,
          isDeleted INTEGER DEFAULT 0,
          FOREIGN KEY (groupId) REFERENCES groups(id) ON DELETE CASCADE
        );
      `);

      // インデックス作成
      sqliteDb.execute(
        'CREATE INDEX IF NOT EXISTS idx_memos_groupId ON memos(groupId);',
      );
      sqliteDb.execute(
        'CREATE INDEX IF NOT EXISTS idx_memos_createdAt ON memos(createdAt);',
      );
      sqliteDb.execute(
        'CREATE INDEX IF NOT EXISTS idx_groups_updatedAt ON groups(updatedAt);',
      );

      // マイグレーション管理テーブル
      sqliteDb.execute(`
        CREATE TABLE IF NOT EXISTS migrations (
          version INTEGER PRIMARY KEY,
          appliedAt INTEGER NOT NULL
        );
      `);

      // バージョン記録
      sqliteDb.execute(`
        INSERT INTO migrations (version, appliedAt) VALUES (1, ${Date.now()});
      `);
    }

    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

/**
 * データベースをリセット（開発用）
 */
export async function resetDatabase(): Promise<void> {
  console.log('Resetting database...');

  const sqliteDb = getSQLiteDatabase();

  if (!sqliteDb) {
    throw new Error('Database not initialized');
  }

  // すべてのテーブルを削除
  sqliteDb.execute('DROP TABLE IF EXISTS memos;');
  sqliteDb.execute('DROP TABLE IF EXISTS groups;');
  sqliteDb.execute('DROP TABLE IF EXISTS migrations;');

  console.log('Database reset complete');

  // マイグレーションを再実行
  await runMigrations();
}

/**
 * 初期データの投入（開発用）
 */
export async function seedDatabase(): Promise<void> {
  console.log('Seeding database...');

  const db = await openDatabase();
  const now = Date.now();

  // サンプルグループの作成
  const groupsData = [
    {
      id: 'group-1',
      name: 'アイデアメモ',
      description: 'ひらめいたアイデアをすぐにメモ',
      color: 'blue',
      icon: '💡',
      createdAt: new Date(now - 1000 * 60 * 60 * 24 * 7), // 7日前
      updatedAt: new Date(now - 1000 * 60 * 5), // 5分前
    },
    {
      id: 'group-2',
      name: '買い物リスト',
      description: '買うものをメモ',
      color: 'green',
      icon: '🛒',
      createdAt: new Date(now - 1000 * 60 * 60 * 24 * 3), // 3日前
      updatedAt: new Date(now - 1000 * 60 * 60 * 2), // 2時間前
    },
    {
      id: 'group-3',
      name: '仕事のタスク',
      description: '今日やることリスト',
      color: 'purple',
      icon: '📋',
      createdAt: new Date(now - 1000 * 60 * 60 * 24 * 14), // 14日前
      updatedAt: new Date(now - 1000 * 60 * 60 * 24), // 1日前
    },
  ];

  // グループを挿入
  await db
    .insert(schema.groups)
    .values(groupsData)
    .onConflictDoUpdate({
      target: schema.groups.id,
      set: {
        name: sql`excluded.name`,
        description: sql`excluded.description`,
        color: sql`excluded.color`,
        icon: sql`excluded.icon`,
        updatedAt: sql`excluded.updatedAt`,
      },
    });

  // サンプルメモの作成
  const memosData = [
    {
      id: 'memo-1',
      groupId: 'group-1',
      content: '新しいアプリのコンセプト: チャット形式のメモアプリ',
      imageUri: null,
      createdAt: new Date(now - 1000 * 60 * 5),
      updatedAt: new Date(now - 1000 * 60 * 5),
      isDeleted: false,
    },
    {
      id: 'memo-2',
      groupId: 'group-2',
      content: '牛乳、パン、卵',
      imageUri: null,
      createdAt: new Date(now - 1000 * 60 * 60 * 2),
      updatedAt: new Date(now - 1000 * 60 * 60 * 2),
      isDeleted: false,
    },
    {
      id: 'memo-3',
      groupId: 'group-3',
      content: 'プレゼン資料の作成',
      imageUri: null,
      createdAt: new Date(now - 1000 * 60 * 60 * 24),
      updatedAt: new Date(now - 1000 * 60 * 60 * 24),
      isDeleted: false,
    },
  ];

  // メモを挿入
  await db
    .insert(schema.memos)
    .values(memosData)
    .onConflictDoUpdate({
      target: schema.memos.id,
      set: {
        content: sql`excluded.content`,
        updatedAt: sql`excluded.updatedAt`,
      },
    });

  console.log('Database seeded successfully');
}
