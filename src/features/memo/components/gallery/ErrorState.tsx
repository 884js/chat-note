import { AlertCircle, RefreshCw } from '@tamagui/lucide-icons';
import { memo } from 'react';
import { Button, Text, YStack } from 'tamagui';

interface ErrorStateProps {
  error?: Error | null;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState = memo(function ErrorState({
  error,
  message = 'エラーが発生しました',
  onRetry,
}: ErrorStateProps) {
  return (
    <YStack flex={1} justify="center" items="center" p="$8" gap="$4">
      <AlertCircle size={48} color="$color8" />
      <YStack gap="$2" items="center">
        <Text
          fontSize="$5"
          fontWeight="600"
          color="$color11"
          style={{ textAlign: 'center' }}
        >
          {message}
        </Text>
        {error?.message && (
          <Text fontSize="$3" color="$color8" style={{ textAlign: 'center' }}>
            {error.message}
          </Text>
        )}
      </YStack>
      {onRetry && (
        <Button icon={RefreshCw} size="$4" onPress={onRetry}>
          再試行
        </Button>
      )}
    </YStack>
  );
});
