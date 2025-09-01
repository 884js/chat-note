import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { saveBackupToDevice, shareBackup } from '../services/exportService';
import { importBackupData } from '../services/importService';
import type { ExportResult, ImportOptions, ImportResult } from '../types';

const LAST_BACKUP_KEY = 'lastBackupDate';

/**
 * バックアップ機能を提供するカスタムフック
 */
export function useBackup() {
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [lastBackupDate, setLastBackupDate] = useState<Date | null>(null);
  const queryClient = useQueryClient();

  /**
   * 最終バックアップ日時を取得
   */
  const loadLastBackupDate = useCallback(async () => {
    try {
      const dateString = await AsyncStorage.getItem(LAST_BACKUP_KEY);
      if (dateString) {
        setLastBackupDate(new Date(dateString));
      }
    } catch (error) {
      console.error('最終バックアップ日時の取得エラー:', error);
    }
  }, []);

  /**
   * デバイスに保存
   */
  const handleSaveToDevice = useCallback(async () => {
    setIsSaving(true);
    try {
      const result: ExportResult = await saveBackupToDevice();

      if (result.success) {
        // 成功時の処理
        const now = new Date();
        await AsyncStorage.setItem(LAST_BACKUP_KEY, now.toISOString());
        setLastBackupDate(now);

        const message =
          Platform.OS === 'android'
            ? '選択したフォルダにバックアップファイルを保存しました'
            : 'アプリ内にバックアップファイルを保存しました';

        Alert.alert('保存完了', message, [{ text: 'OK' }]);
      } else {
        // エラー時の処理
        Alert.alert(
          '保存エラー',
          result.error || 'デバイスへの保存に失敗しました',
          [{ text: 'OK' }],
        );
      }
    } catch (error) {
      console.error('保存エラー:', error);
      Alert.alert('保存エラー', '保存中にエラーが発生しました', [
        { text: 'OK' },
      ]);
    } finally {
      setIsSaving(false);
    }
  }, []);

  /**
   * 共有処理
   */
  const handleShare = useCallback(async () => {
    setIsSharing(true);
    try {
      const result: ExportResult = await shareBackup();

      if (result.success) {
        // 成功時の処理
        const now = new Date();
        await AsyncStorage.setItem(LAST_BACKUP_KEY, now.toISOString());
        setLastBackupDate(now);
      } else {
        // エラー時の処理
        Alert.alert('共有エラー', result.error || '共有に失敗しました', [
          { text: 'OK' },
        ]);
      }
    } catch (error) {
      console.error('共有エラー:', error);
      Alert.alert('共有エラー', '共有中にエラーが発生しました', [
        { text: 'OK' },
      ]);
    } finally {
      setIsSharing(false);
    }
  }, []);

  /**
   * インポート処理
   */
  const handleImport = useCallback(
    async (options?: ImportOptions) => {
      // 確認ダイアログを表示
      Alert.alert(
        'インポートの確認',
        'バックアップファイルからデータをインポートしますか？',
        [
          { text: 'キャンセル', style: 'cancel' },
          {
            text: 'インポート',
            onPress: async () => {
              setIsImporting(true);
              try {
                const result: ImportResult = await importBackupData(
                  options || { duplicateStrategy: 'skip' },
                );

                if (result.success) {
                  // データを再読み込み
                  await queryClient.invalidateQueries();

                  const message = [
                    'インポート完了',
                    `グループ: ${result.groupsImported}件インポート、${result.groupsSkipped}件スキップ`,
                    `メモ: ${result.memosImported}件インポート、${result.memosSkipped}件スキップ`,
                  ].join('\n');

                  Alert.alert('インポート完了', message, [{ text: 'OK' }]);
                } else {
                  Alert.alert(
                    'インポートエラー',
                    result.error || 'インポートに失敗しました',
                    [{ text: 'OK' }],
                  );
                }
              } catch (error) {
                console.error('インポートエラー:', error);
                Alert.alert(
                  'インポートエラー',
                  'インポート中にエラーが発生しました',
                  [{ text: 'OK' }],
                );
              } finally {
                setIsImporting(false);
              }
            },
          },
        ],
      );
    },
    [queryClient],
  );

  /**
   * インポートオプションを選択してインポート
   */
  const handleImportWithOptions = useCallback(() => {
    Alert.alert(
      '重複データの処理',
      '既存のデータと重複する場合の処理を選択してください',
      [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: 'スキップ',
          onPress: () => handleImport({ duplicateStrategy: 'skip' }),
        },
        {
          text: '上書き',
          onPress: () => handleImport({ duplicateStrategy: 'overwrite' }),
        },
        {
          text: '名前を変更して追加',
          onPress: () => handleImport({ duplicateStrategy: 'rename' }),
        },
      ],
    );
  }, [handleImport]);

  return {
    isSaving,
    isSharing,
    isImporting,
    lastBackupDate,
    loadLastBackupDate,
    handleSaveToDevice,
    handleShare,
    handleImport: handleImportWithOptions,
  };
}
