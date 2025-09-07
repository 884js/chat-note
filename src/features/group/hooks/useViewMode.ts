import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

export type ViewMode = 'list' | 'grid';

const VIEW_MODE_KEY = 'group_view_mode';

export function useViewMode() {
  const [viewMode, setViewModeState] = useState<ViewMode>('list');
  const [isLoading, setIsLoading] = useState(true);

  // 初期読み込み
  useEffect(() => {
    const loadViewMode = async () => {
      try {
        const savedMode = await AsyncStorage.getItem(VIEW_MODE_KEY);
        if (savedMode === 'grid' || savedMode === 'list') {
          setViewModeState(savedMode);
        }
      } catch (error) {
        console.error('Failed to load view mode:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadViewMode();
  }, []);

  // ビューモードの切り替え
  const toggleViewMode = useCallback(async () => {
    const newMode: ViewMode = viewMode === 'list' ? 'grid' : 'list';
    try {
      await AsyncStorage.setItem(VIEW_MODE_KEY, newMode);
      setViewModeState(newMode);
    } catch (error) {
      console.error('Failed to save view mode:', error);
    }
  }, [viewMode]);

  // 特定のモードに設定
  const setViewMode = useCallback(async (mode: ViewMode) => {
    try {
      await AsyncStorage.setItem(VIEW_MODE_KEY, mode);
      setViewModeState(mode);
    } catch (error) {
      console.error('Failed to save view mode:', error);
    }
  }, []);

  return {
    viewMode,
    toggleViewMode,
    setViewMode,
    isLoading,
  };
}
