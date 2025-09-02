import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as SQLite from 'expo-sqlite';
import * as schema from './schema';

// 型エイリアス
type DrizzleDB = ReturnType<typeof drizzle>;

// データベース名
export const DATABASE_NAME = 'memoly.db';

// データベースインスタンス
let db: DrizzleDB | null = null;
let sqliteDb: SQLite.SQLiteDatabase | null = null;
let initializationPromise: Promise<DrizzleDB> | null = null;

/**
 * データベースを開く
 * 複数の同時呼び出しに対して安全（シングルトンパターン）
 */
export async function openDatabase(): Promise<DrizzleDB> {
  // 既に初期化済みの場合は即座に返す
  if (db) {
    return db;
  }

  // 初期化中の場合は、その完了を待つ
  if (initializationPromise) {
    return initializationPromise;
  }

  // 初期化処理を開始
  initializationPromise = (async () => {
    try {
      console.log('[DB] Opening database...');

      // SQLiteデータベースを開く
      sqliteDb = await SQLite.openDatabaseAsync(DATABASE_NAME);

      // パフォーマンス最適化のPRAGMA設定
      await sqliteDb.execAsync('PRAGMA journal_mode = WAL;'); // WALモード有効化
      await sqliteDb.execAsync('PRAGMA foreign_keys = ON;'); // 外部キー制約有効化
      await sqliteDb.execAsync('PRAGMA synchronous = NORMAL;'); // 書き込みパフォーマンス向上
      await sqliteDb.execAsync('PRAGMA cache_size = -64000;'); // キャッシュサイズ64MB
      await sqliteDb.execAsync('PRAGMA temp_store = MEMORY;'); // 一時テーブルをメモリに保存

      // Drizzle ORMインスタンスを作成
      db = drizzle(sqliteDb, { schema });

      console.log('[DB] Database opened successfully');
      return db;
    } catch (error) {
      console.error('[DB] Failed to open database:', error);
      // エラーが発生した場合は初期化をリセット
      initializationPromise = null;
      db = null;
      sqliteDb = null;
      throw new Error(
        `Database initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  })();

  return initializationPromise;
}

/**
 * データベースを閉じる
 * 注意: 通常はアプリのライフサイクル全体でデータベース接続を維持するため、
 * この関数は基本的に使用しない
 */
export async function closeDatabase(): Promise<void> {
  if (sqliteDb) {
    await sqliteDb.closeAsync();
    sqliteDb = null;
    db = null;
    initializationPromise = null;
  }
}

/**
 * データベースインスタンスを取得
 */
export function getDatabase(): DrizzleDB | null {
  return db;
}

/**
 * SQLiteインスタンスを取得（マイグレーション用）
 */
export function getSQLiteDatabase() {
  return sqliteDb;
}
