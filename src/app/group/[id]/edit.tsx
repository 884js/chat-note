import { GroupForm } from '@/features/group/components/GroupForm';
import { GroupFormHeader } from '@/features/group/components/GroupFormHeader';
import { useEditGroupForm } from '@/features/group/hooks/useEditGroupForm';
import { Stack, useLocalSearchParams } from 'expo-router';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { YStack } from 'tamagui';

export default function EditGroupScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) {
    return null;
  }

  const {
    formData,
    errors,
    isSubmitting,
    isLoading,
    canSubmit,
    updateField,
    handleSubmit,
    handleCancel,
  } = useEditGroupForm(id);

  // ローディング中は何も表示しない
  if (isLoading) {
    return null;
  }

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
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            canSubmit={canSubmit}
            mode="edit"
          />

          {/* フォーム */}
          <GroupForm
            formData={formData}
            errors={errors}
            onUpdateField={updateField}
            isSubmitting={isSubmitting}
          />
        </YStack>
      </KeyboardAvoidingView>
    </>
  );
}
