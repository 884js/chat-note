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
    const tableExists = await sqliteDb.getAllAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM sqlite_master
      WHERE type='table' AND name='groups';`,
    );

    if (tableExists[0]?.count === 0) {
      // 初回マイグレーション
      console.log('Creating initial tables...');

      // Groups テーブル作成
      await sqliteDb.execAsync(`
        CREATE TABLE IF NOT EXISTS groups (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          color TEXT NOT NULL,
          icon TEXT,
          isArchived INTEGER DEFAULT 0 NOT NULL,
          createdAt INTEGER NOT NULL,
          updatedAt INTEGER NOT NULL
        );
      `);

      // Memos テーブル作成
      await sqliteDb.execAsync(`
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
      await sqliteDb.execAsync(
        'CREATE INDEX IF NOT EXISTS idx_memos_groupId ON memos(groupId);',
      );
      await sqliteDb.execAsync(
        'CREATE INDEX IF NOT EXISTS idx_memos_createdAt ON memos(createdAt);',
      );
      await sqliteDb.execAsync(
        'CREATE INDEX IF NOT EXISTS idx_groups_updatedAt ON groups(updatedAt);',
      );
      await sqliteDb.execAsync(
        'CREATE INDEX IF NOT EXISTS idx_groups_isArchived ON groups(isArchived);',
      );

      // マイグレーション管理テーブル
      await sqliteDb.execAsync(`
        CREATE TABLE IF NOT EXISTS migrations (
          version INTEGER PRIMARY KEY,
          appliedAt INTEGER NOT NULL
        );
      `);

      // バージョン記録
      await sqliteDb.execAsync(`
        INSERT INTO migrations (version, appliedAt) VALUES (1, ${Date.now()});
      `);
    } else {
      // 既存のテーブルがある場合、isArchivedカラムが存在するか確認
      const columnExists = await sqliteDb.getAllAsync<{ count: number }>(
        `SELECT COUNT(*) as count FROM pragma_table_info('groups') WHERE name='isArchived';`,
      );

      if (columnExists[0]?.count === 0) {
        console.log('Adding isArchived column to groups table...');
        // isArchivedカラムを追加
        await sqliteDb.execAsync(
          'ALTER TABLE groups ADD COLUMN isArchived INTEGER DEFAULT 0 NOT NULL;',
        );
        // インデックスを作成
        await sqliteDb.execAsync(
          'CREATE INDEX IF NOT EXISTS idx_groups_isArchived ON groups(isArchived);',
        );
        // マイグレーション記録
        await sqliteDb.execAsync(`
          INSERT OR IGNORE INTO migrations (version, appliedAt) VALUES (3, ${Date.now()});
        `);
      }
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
  await sqliteDb.execAsync('DROP TABLE IF EXISTS memos;');
  await sqliteDb.execAsync('DROP TABLE IF EXISTS groups;');
  await sqliteDb.execAsync('DROP TABLE IF EXISTS migrations;');

  console.log('Database reset complete');

  // マイグレーションを再実行
  await runMigrations();
}

/**
 * 初期データの投入（初回起動時のみ）
 */
export async function seedDatabase(): Promise<void> {
  const db = await openDatabase();
  const sqliteDb = getSQLiteDatabase();

  if (!sqliteDb) {
    throw new Error('Database not initialized');
  }

  // 既存のデータがあるかチェック（意図的に削除した場合は再生成しない）
  const existingGroups = await sqliteDb.getAllAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM groups;',
  );

  if (existingGroups[0]?.count > 0) {
    console.log('Data already exists, skipping seed');
    return;
  }

  // migrationsテーブルで初回起動かチェック
  const migrationCount = await sqliteDb.getAllAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM migrations WHERE version > 1;',
  );

  if (migrationCount[0]?.count > 0) {
    // 初回以降のマイグレーションが実行されている = ユーザーが意図的にデータを削除
    console.log('User has cleared data, skipping seed');
    return;
  }

  console.log('Seeding initial data...');
  const now = Date.now();

  // ウェルカムグループを1つだけ作成
  const welcomeGroup = {
    id: 'welcome-group',
    name: 'はじめてのメモ',
    description: 'ChatMemoへようこそ！',
    color: 'blue',
    icon: '👋',
    isArchived: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 2), // 2日前
    updatedAt: new Date(now - 1000 * 60 * 5), // 5分前
  };

  await db.insert(schema.groups).values(welcomeGroup);

  // 使い方を説明するサンプルメモ
  const sampleMemos = [
    {
      id: 'welcome-1',
      groupId: 'welcome-group',
      content: 'ようこそ！🎉\nここはあなた専用のメモ空間です',
      imageUri: null,
      createdAt: new Date(now - 1000 * 60 * 60 * 24 * 2), // 2日前
      updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 2),
      isDeleted: false,
    },
    {
      id: 'welcome-2',
      groupId: 'welcome-group',
      content:
        'グループを作って、メモを整理できます\n例：仕事、プライベート、アイデアなど',
      imageUri: null,
      createdAt: new Date(now - 1000 * 60 * 60 * 24 * 2 + 1000 * 60), // 2日前+1分
      updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 2 + 1000 * 60),
      isDeleted: false,
    },
    {
      id: 'welcome-3',
      groupId: 'welcome-group',
      content: '画像も添付できます📸',
      imageUri: null,
      createdAt: new Date(now - 1000 * 60 * 60 * 24), // 1日前
      updatedAt: new Date(now - 1000 * 60 * 60 * 24),
      isDeleted: false,
    },
    {
      id: 'welcome-4',
      groupId: 'welcome-group',
      content: 'URLも自動でリンクになります\nhttps://example.com',
      imageUri: null,
      createdAt: new Date(now - 1000 * 60 * 60 * 12), // 12時間前
      updatedAt: new Date(now - 1000 * 60 * 60 * 12),
      isDeleted: false,
    },
    {
      id: 'welcome-5',
      groupId: 'welcome-group',
      content: 'メモを長押しすると編集・削除できます✏️',
      imageUri: null,
      createdAt: new Date(now - 1000 * 60 * 30), // 30分前
      updatedAt: new Date(now - 1000 * 60 * 30),
      isDeleted: false,
    },
    {
      id: 'welcome-6',
      groupId: 'welcome-group',
      content: '右上の+ボタンから新しいグループを作成してみましょう！',
      imageUri: null,
      createdAt: new Date(now - 1000 * 60 * 5), // 5分前
      updatedAt: new Date(now - 1000 * 60 * 5),
      isDeleted: false,
    },
  ];

  await db.insert(schema.memos).values(sampleMemos);

  // 初回セットアップ完了を記録
  await sqliteDb.execAsync(`
    INSERT OR IGNORE INTO migrations (version, appliedAt) 
    VALUES (2, ${Date.now()});
  `);

  console.log('Initial data seeded successfully');
}
