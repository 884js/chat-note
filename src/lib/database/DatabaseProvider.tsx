import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { closeDatabase, getDatabase, openDatabase } from './db';
import { runMigrations, seedDatabase } from './migrate';

interface DatabaseContextType {
  database: ReturnType<typeof getDatabase> | null;
  isReady: boolean;
  error: Error | null;
}

const DatabaseContext = createContext<DatabaseContextType>({
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

  useEffect(() => {
    let isMounted = true;

    async function initializeDatabase() {
      try {
        console.log('Initializing database...');

        // データベースを開く
        await openDatabase();

        if (!isMounted) {
          await closeDatabase();
          return;
        }

        // マイグレーションを実行
        await runMigrations();

        // 開発時のみ: 初期データ投入
        if (seedData && __DEV__) {
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
      // クリーンアップ: データベースを閉じる
      closeDatabase().catch(console.error);
    };
  }, [seedData]);

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
