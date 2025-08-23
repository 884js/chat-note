import { YStack, ScrollView } from 'tamagui';
import { Stack } from 'expo-router';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { useCreateGroupForm } from '@/features/group/hooks/useCreateGroupForm';
import { GroupFormHeader } from '@/features/group/components/GroupFormHeader';
import { GroupNameInput } from '@/features/group/components/GroupNameInput';
import { GroupDescriptionInput } from '@/features/group/components/GroupDescriptionInput';

export default function CreateGroupScreen() {
  const {
    formData,
    errors,
    isCreating,
    canSubmit,
    updateField,
    handleCreate,
    handleCancel,
  } = useCreateGroupForm();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <YStack flex={1} bg="$background">
          {/* ヘッダー */}
          <GroupFormHeader
            onCancel={handleCancel}
            onCreate={handleCreate}
            isCreating={isCreating}
            canCreate={canSubmit}
          />

          {/* フォーム */}
          <ScrollView
            flex={1}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <YStack p="$4" gap="$6">
              {/* グループ名入力 */}
              <GroupNameInput
                value={formData.name}
                onChange={(value) => updateField('name', value)}
                error={errors.name}
                disabled={isCreating}
              />

              {/* 説明入力 */}
              <GroupDescriptionInput
                value={formData.description}
                onChange={(value) => updateField('description', value)}
                disabled={isCreating}
              />
            </YStack>
          </ScrollView>
        </YStack>
      </KeyboardAvoidingView>
    </>
  );
}
