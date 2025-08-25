import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as SQLite from 'expo-sqlite';
import * as schema from './schema';

// データベース名
const DATABASE_NAME = 'chat-note.db';

// データベースインスタンス
let db: ReturnType<typeof drizzle> | null = null;
let sqliteDb: SQLite.SQLiteDatabase | null = null;

/**
 * データベースを開く
 */
export async function openDatabase() {
  if (!db) {
    // SQLiteデータベースを開く
    sqliteDb = await SQLite.openDatabaseAsync(DATABASE_NAME);

    // WALモード有効化（パフォーマンス向上）
    await sqliteDb.execAsync('PRAGMA journal_mode = WAL;');

    // 外部キー制約有効化
    await sqliteDb.execAsync('PRAGMA foreign_keys = ON;');

    // Drizzle ORMインスタンスを作成
    db = drizzle(sqliteDb, { schema });
  }

  return db;
}

/**
 * データベースを閉じる
 */
export async function closeDatabase(): Promise<void> {
  if (sqliteDb) {
    await sqliteDb.closeAsync();
    sqliteDb = null;
    db = null;
  }
}

/**
 * データベースインスタンスを取得
 */
export function getDatabase() {
  return db;
}

/**
 * SQLiteインスタンスを取得（マイグレーション用）
 */
export function getSQLiteDatabase() {
  return sqliteDb;
}
