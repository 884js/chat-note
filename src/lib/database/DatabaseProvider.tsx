import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { openDatabaseSync } from 'expo-sqlite';
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import migrations from '../../../drizzle/migrations';
import { DATABASE_NAME, getDatabase, openDatabase } from './db';
import { seedDatabase } from './migrate';

interface DatabaseContextType {
  database: ReturnType<typeof getDatabase> | null;
  isReady: boolean;
  error: Error | null;
}

export const DatabaseContext = createContext<DatabaseContextType>({
  database: null,
  isReady: false,
  error: null,
});

interface DatabaseProviderProps {
  children: ReactNode;
  seedData?: boolean; // 開発用: 初期データを投入するか
}

const expoDb = openDatabaseSync(DATABASE_NAME);
const db = drizzle(expoDb);

export function DatabaseProvider({
  children,
  seedData = false,
}: DatabaseProviderProps) {
  // useDrizzleStudio(expoDb);

  const [database, setDatabase] = useState<ReturnType<
    typeof getDatabase
  > | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { success: migrationsSuccess, error: migrationError } = useMigrations(
    db,
    migrations,
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    let isMounted = true;
    // seedDataの初期値を保存（再レンダリング時の変更を無視）
    const shouldSeed = seedData;

    async function initializeDatabase() {
      try {
        console.log('Initializing database after migrations...');

        // データベースを開く
        await openDatabase();

        if (!isMounted) {
          return;
        }

        // 開発時のみ: 初期データ投入
        if (shouldSeed && __DEV__) {
          // データが空の場合のみシードを実行
          const { getGroupCount } = await import(
            './repositories/groupRepository'
          );
          const count = await getGroupCount();

          if (count === 0) {
            await seedDatabase();
          }
        }

        const db = getDatabase();
        if (isMounted) {
          setDatabase(db);
          setIsReady(true);
          console.log('Database initialized successfully');
        }
      } catch (err) {
        console.error('Failed to initialize database:', err);
        if (isMounted) {
          setError(err as Error);
          setIsReady(true); // エラーでも ready にして、エラー表示可能にする
        }
      }
    }

    initializeDatabase();

    return () => {
      isMounted = false;
      // データベース接続は維持（アプリのライフサイクル全体で使用）
    };
  }, [migrationsSuccess, migrationError]); // マイグレーション状態に依存

  return (
    <DatabaseContext.Provider value={{ database, isReady, error }}>
      {children}
    </DatabaseContext.Provider>
  );
}

/**
 * データベースコンテキストを使用するフック
 */
export function useDatabase() {
  const context = useContext(DatabaseContext);

  if (!context) {
    throw new Error('useDatabase must be used within DatabaseProvider');
  }

  return context;
}
