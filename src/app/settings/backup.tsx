import { useBackup } from '@/features/backup/hooks/useBackup';
import { getAllGroupsForExport } from '@/lib/database/repositories/groupRepository';
import { getAllMemosForExport } from '@/lib/database/repositories/memoRepository';
import {
  ArrowLeft,
  Calendar,
  Database,
  Download,
  Info,
  Share2,
  Upload,
} from '@tamagui/lucide-icons';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Button,
  Card,
  ScrollView,
  Separator,
  Spinner,
  Text,
  Theme,
  XStack,
  YStack,
} from 'tamagui';

export default function BackupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const {
    isSaving,
    isSharing,
    isImporting,
    lastBackupDate,
    loadLastBackupDate,
    handleSaveToDevice,
    handleShare,
    handleImport,
  } = useBackup();

  const [statistics, setStatistics] = useState({
    groupCount: 0,
    memoCount: 0,
    imageCount: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // 統計情報を読み込み
  useEffect(() => {
    loadStatistics();
    loadLastBackupDate();
  }, [loadLastBackupDate]);

  const loadStatistics = async () => {
    try {
      setIsLoadingStats(true);
      const groups = await getAllGroupsForExport();
      const memos = await getAllMemosForExport();
      const imageCount = memos.filter((m) => m.imageUri).length;

      setStatistics({
        groupCount: groups.length,
        memoCount: memos.length,
        imageCount,
      });
    } catch (error) {
      console.error('統計情報の読み込みエラー:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <StatusBar 
        style={colorScheme === 'dark' ? 'light' : 'dark'} 
        translucent 
      />
      <Theme name={colorScheme === 'dark' ? 'dark' : 'light'}>
        <YStack flex={1} bg="$background">
      {/* ヘッダー */}
      <XStack
        pt={insets.top}
        pb="$3"
        px="$4"
        bg="$color3"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
        gap="$3"
      >
        <Button
          size="$3"
          chromeless
          icon={<ArrowLeft size={24} />}
          onPress={handleBack}
        />
        <Text fontSize="$6" fontWeight="bold" flex={1}>
          バックアップ
        </Text>
      </XStack>

      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <YStack p="$4" gap="$4">
          {/* バックアップセクション */}
          <Card p="$4" bordered>
            <YStack gap="$4">
              <XStack gap="$2">
                <Database size={20} color="$color11" />
                <Text fontSize="$6" fontWeight="bold">
                  データ管理
                </Text>
              </XStack>

              <Separator />

              {/* 統計情報 */}
              <YStack gap="$2">
                <Text fontSize="$3" color="$color11">
                  データ統計
                </Text>
                {isLoadingStats ? (
                  <Spinner size="small" />
                ) : (
                  <YStack gap="$1">
                    <Text fontSize="$2" color="$color10">
                      グループ: {statistics.groupCount}件
                    </Text>
                    <Text fontSize="$2" color="$color10">
                      メモ: {statistics.memoCount}件
                    </Text>
                    <Text fontSize="$2" color="$color10">
                      画像: {statistics.imageCount}枚
                    </Text>
                  </YStack>
                )}
              </YStack>

              {/* 最終バックアップ日時 */}
              {lastBackupDate && (
                <XStack gap="$2">
                  <Calendar size={16} color="$color10" />
                  <Text fontSize="$2" color="$color10">
                    最終バックアップ:{' '}
                    {format(lastBackupDate, 'yyyy年MM月dd日 HH:mm', {
                      locale: ja,
                    })}
                  </Text>
                </XStack>
              )}

              {/* エクスポートボタン */}
              <XStack gap="$3">
                <Button
                  flex={1}
                  size="$4"
                  bg="$blue10"
                  color="$color1"
                  icon={<Download size={20} />}
                  onPress={handleSaveToDevice}
                  disabled={isSaving || isImporting}
                >
                  {isSaving ? (
                    <Spinner size="small" color="$color1" />
                  ) : (
                    'デバイスに保存'
                  )}
                </Button>

                <Button
                  flex={1}
                  size="$4"
                  bg="$color8"
                  color="$color1"
                  icon={<Share2 size={20} />}
                  onPress={handleShare}
                  disabled={isSharing || isImporting}
                >
                  {isSharing ? (
                    <Spinner size="small" color="$color1" />
                  ) : (
                    '共有'
                  )}
                </Button>
              </XStack>

              {/* インポートボタン */}
              <Button
                size="$4"
                bg="$color9"
                icon={<Upload size={20} />}
                onPress={handleImport}
                color="$color1"
                disabled={isSaving || isImporting}
              >
                {isImporting ? (
                  <XStack gap="$2">
                    <Spinner size="small" color="$color1" />
                    <Text>インポート中...</Text>
                  </XStack>
                ) : (
                  'データをインポート'
                )}
              </Button>
            </YStack>
          </Card>

          {/* 注意事項 */}
          <Card p="$4" bordered>
            <YStack gap="$3">
              <XStack gap="$2">
                <Info size={20} color="$color11" />
                <Text fontSize="$4" fontWeight="bold" color="$color11">
                  注意事項
                </Text>
              </XStack>

              <YStack gap="$2">
                <Text fontSize="$2" color="$color11">
                  • インポート時は重複データの処理方法を選択できます
                </Text>
                <Text fontSize="$2" color="$color11">
                  • バックアップファイルは安全な場所に保管してください
                </Text>
              </YStack>
            </YStack>
          </Card>
        </YStack>
        </ScrollView>
        </YStack>
      </Theme>
    </>
  );
}
