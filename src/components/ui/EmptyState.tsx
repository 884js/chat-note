import { Plus } from '@tamagui/lucide-icons';
import { Button, Paragraph, Text, YStack } from 'tamagui';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <YStack flex={1} justify="center" items="center" p="$6" gap="$4">
      {icon && <YStack opacity={0.5}>{icon}</YStack>}

      <YStack gap="$2" items="center">
        <Text fontSize="$6" fontWeight="600">
          {title}
        </Text>

        {description && (
          <Paragraph fontSize="$4" opacity={0.7} maxW={300}>
            {description}
          </Paragraph>
        )}
      </YStack>

      {action && (
        <Button
          size="$4"
          icon={Plus}
          onPress={action.onPress}
          animation="quick"
          pressStyle={{ scale: 0.95 }}
        >
          {action.label}
        </Button>
      )}
    </YStack>
  );
}
