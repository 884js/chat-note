import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '../../../drizzle/migrations';
import { getDatabase, getSQLiteDatabase, openDatabase } from './db';
import * as schema from './schema';

/**
 * マイグレーションを実行
 */
export async function runMigrations(): Promise<void> {
  console.log('Running migrations...');

  await openDatabase(); // データベース接続を確立
  const db = getDatabase();

  if (!db) {
    throw new Error('Database not initialized');
  }

  try {
    await migrate(db, migrations);
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
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

  // Drizzleのマイグレーション履歴テーブルで初回起動かチェック
  try {
    const migrationCount = await sqliteDb.getAllAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM __drizzle_migrations;',
    );

    // 2回目以降のマイグレーションが実行されている場合はスキップ
    if (migrationCount[0]?.count > 1) {
      console.log('User has cleared data, skipping seed');
      return;
    }
  } catch (error) {
    // テーブルが存在しない場合は初回起動とみなす
    console.log('No migration history found, proceeding with seed');
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

  console.log('Initial data seeded successfully');
}
