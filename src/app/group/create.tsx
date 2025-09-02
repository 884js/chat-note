import { GroupDescriptionInput } from '@/features/group/components/GroupDescriptionInput';
import { GroupFormHeader } from '@/features/group/components/GroupFormHeader';
import { GroupNameInput } from '@/features/group/components/GroupNameInput';
import { IconPicker } from '@/features/group/components/IconPicker';
import { useCreateGroupForm } from '@/features/group/hooks/useCreateGroupForm';
import { Stack } from 'expo-router';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Text, View, YStack } from 'tamagui';

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
        behavior={Platform.OS === "ios" ? "padding" : "height"}
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
          <View
            flex={1}
            bg="$background"
          >
            <YStack p="$4" gap="$6">
              {/* グループ名入力 */}
              <GroupNameInput
                value={formData.name}
                onChange={(value) => updateField("name", value)}
                error={errors.name}
                disabled={isCreating}
              />

              {/* 説明入力 */}
              <GroupDescriptionInput
                value={formData.description}
                onChange={(value) => updateField("description", value)}
                disabled={isCreating}
              />

              {/* アイコン選択 */}
              <YStack gap="$2">
                <Text fontSize="$4" fontWeight="500" color="$color12">
                  アイコン
                </Text>
                <IconPicker
                  value={formData.icon}
                  onChange={(icon) => updateField("icon", icon)}
                  disabled={isCreating}
                />
              </YStack>
            </YStack>
          </View>
        </YStack>
      </KeyboardAvoidingView>
    </>
  );
}
