import { GroupForm } from '@/features/group/components/GroupForm';
import { GroupFormHeader } from '@/features/group/components/GroupFormHeader';
import { useCreateGroupForm } from '@/features/group/hooks/useCreateGroupForm';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView, Platform, useColorScheme } from 'react-native';
import { Theme, YStack } from 'tamagui';

export default function CreateGroupScreen() {
  const colorScheme = useColorScheme();
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
      </Theme>
    </>
  );
}
