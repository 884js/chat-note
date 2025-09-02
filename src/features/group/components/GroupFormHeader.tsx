import { X } from '@tamagui/lucide-icons';
import { memo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Text, XStack } from 'tamagui';

interface GroupFormHeaderProps {
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  canSubmit: boolean;
  mode: 'create' | 'edit';
}

export const GroupFormHeader = memo(function GroupFormHeader({
  onCancel,
  onSubmit,
  isSubmitting,
  canSubmit,
  mode,
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
        disabled={isSubmitting}
        color="$color11"
        circular
      />

      <Text fontSize="$5" fontWeight="700" color="$color12">
        {mode === 'create' ? '新しいグループ' : 'グループ編集'}
      </Text>

      <Button size="$4" onPress={onSubmit} disabled={!canSubmit} themeInverse>
        {mode === 'create' ? '作成' : '保存'}
      </Button>
    </XStack>
  );
});
