import { openDatabase } from './database';

// 現在のスキーマバージョン
const CURRENT_VERSION = 1;

/**
 * マイグレーション定義
 */
const migrations: { [version: number]: string[] } = {
  1: [
    // groups テーブル作成
    `CREATE TABLE IF NOT EXISTS groups (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      color TEXT NOT NULL,
      icon TEXT,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );`,

    // memos テーブル作成
    `CREATE TABLE IF NOT EXISTS memos (
      id TEXT PRIMARY KEY,
      groupId TEXT NOT NULL,
      content TEXT,
      imageUri TEXT,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      isDeleted INTEGER DEFAULT 0,
      FOREIGN KEY (groupId) REFERENCES groups(id) ON DELETE CASCADE
    );`,

    // インデックス作成
    `CREATE INDEX IF NOT EXISTS idx_memos_groupId ON memos(groupId);`,
    `CREATE INDEX IF NOT EXISTS idx_memos_createdAt ON memos(createdAt);`,
    `CREATE INDEX IF NOT EXISTS idx_groups_updatedAt ON groups(updatedAt);`,

    // バージョン管理テーブル
    `CREATE TABLE IF NOT EXISTS migrations (
      version INTEGER PRIMARY KEY,
      appliedAt INTEGER NOT NULL
    );`,
  ],
};

/**
 * 現在のデータベースバージョンを取得
 */
async function getCurrentVersion(): Promise<number> {
  const db = await openDatabase();

  try {
    // バージョン管理テーブルが存在するか確認
    const tableExists = await db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM sqlite_master 
       WHERE type='table' AND name='migrations';`,
    );

    if (!tableExists || tableExists.count === 0) {
      return 0;
    }

    // 最新バージョンを取得
    const result = await db.getFirstAsync<{ version: number }>(
      `SELECT MAX(version) as version FROM migrations;`,
    );

    return result?.version || 0;
  } catch (error) {
    console.error('Error getting current version:', error);
    return 0;
  }
}

/**
 * マイグレーションを実行
 */
export async function runMigrations(): Promise<void> {
  const db = await openDatabase();
  const currentVersion = await getCurrentVersion();

  console.log(`Current database version: ${currentVersion}`);
  console.log(`Target version: ${CURRENT_VERSION}`);

  if (currentVersion >= CURRENT_VERSION) {
    console.log('Database is up to date');
    return;
  }

  // トランザクション内でマイグレーションを実行
  await db.withTransactionAsync(async () => {
    for (
      let version = currentVersion + 1;
      version <= CURRENT_VERSION;
      version++
    ) {
      console.log(`Applying migration version ${version}...`);

      const statements = migrations[version];
      if (!statements) {
        throw new Error(`Migration for version ${version} not found`);
      }

      // 各SQLステートメントを実行
      for (const statement of statements) {
        await db.execAsync(statement);
      }

      // バージョンを記録
      await db.runAsync(
        `INSERT INTO migrations (version, appliedAt) VALUES (?, ?);`,
        [version, Date.now()],
      );

      console.log(`Migration version ${version} applied successfully`);
    }
  });

  console.log('All migrations completed successfully');
}

/**
 * データベースをリセット（開発用）
 */
export async function resetDatabase(): Promise<void> {
  const db = await openDatabase();

  console.log('Resetting database...');

  // すべてのテーブルを削除
  await db.execAsync(`DROP TABLE IF EXISTS memos;`);
  await db.execAsync(`DROP TABLE IF EXISTS groups;`);
  await db.execAsync(`DROP TABLE IF EXISTS migrations;`);

  console.log('Database reset complete');

  // マイグレーションを再実行
  await runMigrations();
}

/**
 * 初期データの投入（開発用）
 */
export async function seedDatabase(): Promise<void> {
  const db = await openDatabase();

  console.log('Seeding database...');

  const now = Date.now();

  // サンプルグループの作成
  const groups = [
    {
      id: 'group-1',
      name: 'アイデアメモ',
      description: 'ひらめいたアイデアをすぐにメモ',
      color: 'blue',
      icon: '💡',
      createdAt: now - 1000 * 60 * 60 * 24 * 7, // 7日前
      updatedAt: now - 1000 * 60 * 5, // 5分前
    },
    {
      id: 'group-2',
      name: '買い物リスト',
      description: '買うものをメモ',
      color: 'green',
      icon: '🛒',
      createdAt: now - 1000 * 60 * 60 * 24 * 3, // 3日前
      updatedAt: now - 1000 * 60 * 60 * 2, // 2時間前
    },
    {
      id: 'group-3',
      name: '仕事のタスク',
      description: '今日やることリスト',
      color: 'purple',
      icon: '📋',
      createdAt: now - 1000 * 60 * 60 * 24 * 14, // 14日前
      updatedAt: now - 1000 * 60 * 60 * 24, // 1日前
    },
  ];

  // グループを挿入
  for (const group of groups) {
    await db.runAsync(
      `INSERT OR REPLACE INTO groups (id, name, description, color, icon, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [
        group.id,
        group.name,
        group.description,
        group.color,
        group.icon,
        group.createdAt,
        group.updatedAt,
      ],
    );
  }

  // サンプルメモの作成
  const memos = [
    {
      id: 'memo-1',
      groupId: 'group-1',
      content: '新しいアプリのコンセプト: チャット形式のメモアプリ',
      createdAt: now - 1000 * 60 * 5,
      updatedAt: now - 1000 * 60 * 5,
    },
    {
      id: 'memo-2',
      groupId: 'group-2',
      content: '牛乳、パン、卵',
      createdAt: now - 1000 * 60 * 60 * 2,
      updatedAt: now - 1000 * 60 * 60 * 2,
    },
    {
      id: 'memo-3',
      groupId: 'group-3',
      content: 'プレゼン資料の作成',
      createdAt: now - 1000 * 60 * 60 * 24,
      updatedAt: now - 1000 * 60 * 60 * 24,
    },
  ];

  // メモを挿入
  for (const memo of memos) {
    await db.runAsync(
      `INSERT OR REPLACE INTO memos (id, groupId, content, imageUri, createdAt, updatedAt, isDeleted)
       VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [
        memo.id,
        memo.groupId,
        memo.content,
        null,
        memo.createdAt,
        memo.updatedAt,
        0,
      ],
    );
  }

  console.log('Database seeded successfully');
}
