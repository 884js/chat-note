import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import type { GroupFormData, GroupFormErrors } from './useCreateGroupForm';
import { useGroups } from './useGroups';

export function useEditGroupForm(groupId: string) {
  const router = useRouter();
  const { updateGroup, getGroup } = useGroups();

  // フォーム状態
  const [formData, setFormData] = useState<GroupFormData>({
    name: '',
    description: '',
    icon: '📝',
  });

  const [originalData, setOriginalData] = useState<GroupFormData>({
    name: '',
    description: '',
    icon: '📝',
  });

  const [errors, setErrors] = useState<GroupFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // グループデータの初期読み込み
  useEffect(() => {
    const loadGroup = async () => {
      try {
        const group = await getGroup(groupId);
        if (group) {
          const data = {
            name: group.name,
            description: group.description || '',
            icon: group.icon || '📝',
          };
          setFormData(data);
          setOriginalData(data);
        }
      } catch (error) {
        Alert.alert('エラー', 'グループ情報の読み込みに失敗しました');
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    loadGroup();
  }, [groupId, getGroup, router]);

  // フィールド更新関数
  const updateField = useCallback(
    <K extends keyof GroupFormData>(field: K, value: GroupFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // nameフィールドが更新されたらエラーをクリア
      if (field === 'name' && errors.name) {
        setErrors({});
      }
    },
    [errors.name],
  );

  // バリデーション
  const validateForm = useCallback(() => {
    const newErrors: GroupFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'グループ名を入力してください';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'グループ名は50文字以内で入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.name]);

  // データが変更されたかチェック
  const hasChanges = useCallback(() => {
    return (
      formData.name !== originalData.name ||
      formData.description !== originalData.description ||
      formData.icon !== originalData.icon
    );
  }, [formData, originalData]);

  // グループ更新処理
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    if (!hasChanges()) {
      router.push('/');
      return;
    }

    setIsSubmitting(true);

    try {
      await updateGroup(groupId, {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        icon: formData.icon,
      });

      router.push('/');
    } catch (error) {
      Alert.alert('エラー', 'グループの更新に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, hasChanges, updateGroup, groupId, router]);

  // キャンセル処理
  const handleCancel = useCallback(() => {
    if (hasChanges()) {
      Alert.alert('確認', '変更内容が破棄されますが、よろしいですか？', [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '破棄',
          style: 'destructive',
          onPress: () => router.back(),
        },
      ]);
    } else {
      router.back();
    }
  }, [hasChanges, router]);

  // フォームが送信可能かどうか
  const canSubmit = formData.name.trim().length > 0 && !isSubmitting;

  return {
    formData,
    errors,
    isSubmitting,
    isLoading,
    canSubmit,
    updateField,
    handleSubmit,
    handleCancel,
  };
}