import { memo } from 'react';
import { YStack, Text, TextArea } from 'tamagui';

interface GroupDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const GroupDescriptionInput = memo(function GroupDescriptionInput({
  value,
  onChange,
  disabled = false,
}: GroupDescriptionInputProps) {
  return (
    <YStack gap="$2">
      <Text fontSize="$3" fontWeight="600" color="$color11">
        説明（オプション）
      </Text>
      <TextArea
        size="$4"
        value={value}
        onChangeText={onChange}
        placeholder="このグループの説明を入力"
        numberOfLines={3}
        maxLength={200}
        disabled={disabled}
      />
      <Text fontSize="$2" color="$color10" items="flex-end">
        {value.length}/200
      </Text>
    </YStack>
  );
});
