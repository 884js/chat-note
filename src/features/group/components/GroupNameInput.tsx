import { memo } from 'react';
import { Input, Text, YStack } from 'tamagui';

interface GroupNameInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export const GroupNameInput = memo(function GroupNameInput({
  value,
  onChange,
  error,
  disabled = false,
}: GroupNameInputProps) {
  return (
    <YStack gap="$2">
      <Text fontSize="$3" fontWeight="600" color="$color11">
        グループ名 *
      </Text>
      <Input
        size="$4"
        value={value}
        onChangeText={onChange}
        placeholder="例: アイデアメモ"
        autoFocus
        maxLength={50}
        disabled={disabled}
        borderColor={error ? '#ef4444' : '$borderColor'}
      />
      {error && (
        <Text fontSize="$2" color="#ef4444">
          {error}
        </Text>
      )}
      <Text fontSize="$2" color="$color10" items="flex-end">
        {value.length}/50
      </Text>
    </YStack>
  );
});
