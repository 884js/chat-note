import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import migrations from '../../../drizzle/migrations';
import { type getDatabase, openDatabase } from './db';
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

export function DatabaseProvider({
  children,
  seedData = false,
}: DatabaseProviderProps) {
  const [database, setDatabase] = useState<ReturnType<
    typeof getDatabase
  > | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const shouldSeed = seedData;

    if (isReady) return;

    async function initializeDatabase() {
      try {
        console.log('Initializing database after migrations...');
        // データベースを開く
        const db = await openDatabase();
        await migrate(db, migrations);

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

        setDatabase(db);
        setIsReady(true);
        console.log("Database initialized successfully");
      } catch (err) {
        console.error("Failed to initialize database:", err);
        setError(err as Error);
        setIsReady(true); // エラーでも ready にして、エラー表示可能にする
      }
    }

    initializeDatabase();
  }, []);

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
