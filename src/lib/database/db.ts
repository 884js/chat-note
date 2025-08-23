import { open } from '@op-engineering/op-sqlite';
import { drizzle } from 'drizzle-orm/op-sqlite';
import * as schema from './schema';

// データベース名
const DATABASE_NAME = 'chat-note.db';

// データベースインスタンス
let db: ReturnType<typeof drizzle> | null = null;
let sqliteDb: ReturnType<typeof open> | null = null;

/**
 * データベースを開く
 */
export async function openDatabase() {
  if (!db) {
    // SQLiteデータベースを開く
    sqliteDb = open({
      name: DATABASE_NAME,
    });

    // WALモード有効化（パフォーマンス向上）
    sqliteDb.execute('PRAGMA journal_mode = WAL;');

    // 外部キー制約有効化
    sqliteDb.execute('PRAGMA foreign_keys = ON;');

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
    sqliteDb.close();
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
