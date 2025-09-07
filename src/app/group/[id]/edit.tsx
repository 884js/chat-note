import { GroupForm } from '@/features/group/components/GroupForm';
import { GroupFormHeader } from '@/features/group/components/GroupFormHeader';
import { useEditGroupForm } from '@/features/group/hooks/useEditGroupForm';
import { Stack, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView, Platform, useColorScheme } from 'react-native';
import { Theme, YStack } from 'tamagui';

export default function EditGroupScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();

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
      <StatusBar 
        style={colorScheme === 'dark' ? 'light' : 'dark'} 
        translucent 
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <Theme name={colorScheme === 'dark' ? 'dark' : 'light'}>
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
      </Theme>
    </>
  );
}
