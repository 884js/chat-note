import { Text, View, YStack } from 'tamagui';
import { GroupDescriptionInput } from './GroupDescriptionInput';
import { GroupNameInput } from './GroupNameInput';
import { IconPicker } from './IconPicker';

export interface GroupFormData {
  name: string;
  description: string;
  icon: string;
}

interface GroupFormProps {
  formData: GroupFormData;
  errors: { name?: string };
  onUpdateField: (field: keyof GroupFormData, value: string) => void;
  isSubmitting: boolean;
}

export function GroupForm({
  formData,
  errors,
  onUpdateField,
  isSubmitting,
}: GroupFormProps) {
  return (
    <View flex={1} bg="$background">
      <YStack p="$4" gap="$6">
        {/* グループ名入力 */}
        <GroupNameInput
          value={formData.name}
          onChange={(value) => onUpdateField('name', value)}
          error={errors.name}
          disabled={isSubmitting}
        />

        {/* 説明入力 */}
        <GroupDescriptionInput
          value={formData.description}
          onChange={(value) => onUpdateField('description', value)}
          disabled={isSubmitting}
        />

        {/* アイコン選択 */}
        <YStack gap="$2">
          <Text fontSize="$4" fontWeight="500" color="$color12">
            アイコン
          </Text>
          <IconPicker
            value={formData.icon}
            onChange={(icon) => onUpdateField('icon', icon)}
            disabled={isSubmitting}
          />
        </YStack>
      </YStack>
    </View>
  );
}
