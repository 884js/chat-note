import { X } from '@tamagui/lucide-icons';
import { memo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Text, XStack } from 'tamagui';

interface GroupFormHeaderProps {
  onCancel: () => void;
  onCreate: () => void;
  isCreating: boolean;
  canCreate: boolean;
}

export const GroupFormHeader = memo(function GroupFormHeader({
  onCancel,
  onCreate,
  isCreating,
  canCreate,
}: GroupFormHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <XStack
      bg="$background"
      pt={insets.top}
      pb="$3"
      px="$4"
      borderBottomWidth={1}
      borderBottomColor="$color4"
      items="center"
      justify="space-between"
    >
      <Button
        size="$4"
        icon={X}
        onPress={onCancel}
        chromeless
        disabled={isCreating}
        color="$color11"
        circular
      />

      <Text fontSize="$5" fontWeight="700" color="$color12">
        新しいグループ
      </Text>

      <Button size="$4" onPress={onCreate} disabled={!canCreate} themeInverse>
        作成
      </Button>
    </XStack>
  );
});
