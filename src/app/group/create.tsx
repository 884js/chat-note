import { GroupForm } from '@/features/group/components/GroupForm';
import { GroupFormHeader } from '@/features/group/components/GroupFormHeader';
import { useCreateGroupForm } from '@/features/group/hooks/useCreateGroupForm';
import { Stack } from 'expo-router';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { YStack } from 'tamagui';

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
            onSubmit={handleCreate}
            isSubmitting={isCreating}
            canSubmit={canSubmit}
            mode="create"
          />

          {/* フォーム */}
          <GroupForm
            formData={formData}
            errors={errors}
            onUpdateField={updateField}
            isSubmitting={isCreating}
          />
        </YStack>
      </KeyboardAvoidingView>
    </>
  );
}
