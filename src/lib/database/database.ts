import * as SQLite from 'expo-sqlite';

// データベース名
const DATABASE_NAME = 'chat-note.db';

// データベースインスタンス
let db: SQLite.SQLiteDatabase | null = null;

/**
 * データベースを開く
 */
export async function openDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync(DATABASE_NAME);

    // WALモード有効化（パフォーマンス向上）
    await db.execAsync('PRAGMA journal_mode = WAL;');

    // 外部キー制約有効化
    await db.execAsync('PRAGMA foreign_keys = ON;');
  }

  return db;
}

/**
 * データベースを閉じる
 */
export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.closeAsync();
    db = null;
  }
}

/**
 * データベースインスタンスを取得
 */
export function getDatabase(): SQLite.SQLiteDatabase | null {
  return db;
}

/**
 * トランザクション実行ヘルパー
 */
export async function withTransaction<T>(
  callback: (db: SQLite.SQLiteDatabase) => Promise<T>,
): Promise<T> {
  const database = await openDatabase();

  try {
    return await database.withTransactionAsync(async () => {
      return await callback(database);
    });
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  }
}

/**
 * 準備済みステートメント実行ヘルパー
 */
export async function runAsync(
  query: string,
  params: any[] = [],
): Promise<SQLite.SQLiteRunResult> {
  const database = await openDatabase();
  return await database.runAsync(query, params);
}

/**
 * SELECT実行ヘルパー
 */
export async function getAllAsync<T = any>(
  query: string,
  params: any[] = [],
): Promise<T[]> {
  const database = await openDatabase();
  return (await database.getAllAsync(query, params)) as T[];
}

/**
 * 単一レコード取得ヘルパー
 */
export async function getFirstAsync<T = any>(
  query: string,
  params: any[] = [],
): Promise<T | null> {
  const database = await openDatabase();
  return (await database.getFirstAsync(query, params)) as T | null;
}
